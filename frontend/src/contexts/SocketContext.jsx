import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import { getSocketURL } from "../helper/apiHelper";
import toast from "react-hot-toast";
import { toastInfo } from "../utils/toastHelpers";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

let isPageUnloading = false;
window.addEventListener("beforeunload", () => {
  isPageUnloading = true;
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const connectionAttemptsRef = useRef(0);
  const isInitializingRef = useRef(false);
  const pingIntervalRef = useRef(null);
  const isPageVisibleRef = useRef(true);
  const MAX_RECONNECTION_ATTEMPTS = 5;
  const RECONNECTION_DELAY = 5000;
  const INITIAL_RECONNECTION_DELAY = 1000;
  const PING_INTERVAL = 25000; // 25 seconds
  const userId = user?.userId || user?._id;

  const startPingInterval = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    pingIntervalRef.current = setInterval(() => {
      if (socketRef.current?.connected && isPageVisibleRef.current) {
        socketRef.current.emit("client_ping");
      }
    }, PING_INTERVAL);
  }, []);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const wasVisible = isPageVisibleRef.current;
      isPageVisibleRef.current = !document.hidden;

      // Only handle reconnection if the page becomes visible again
      if (wasVisible && !isPageVisibleRef.current) {
        // Page is hidden, pause ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
      } else if (!wasVisible && isPageVisibleRef.current) {
        // Page is visible again, resume ping interval
        if (socketRef.current?.connected) {
          startPingInterval();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startPingInterval]);

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const cleanupSocket = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.close();
      socketRef.current = null;
    }
    setSocket(null);
    setIsConnected(false);
    setConnectionError(null);
    isInitializingRef.current = false;
    setIsInitializing(false);
  }, []);

  const handleRoomJoin = useCallback((socket, userId) => {
    return new Promise((resolve, reject) => {
      socket.emit("join_room", userId, (response) => {
        if (response?.success) {
          resolve(response);
        } else {
          console.error(
            `Failed to join room for user ${userId}:`,
            response?.error
          );
          reject(new Error(response?.error || "Failed to join room"));
        }
      });
    });
  }, []);

  const initializeSocket = useCallback(async () => {
    if (
      isInitializingRef.current ||
      !isAuthenticated ||
      !isPageVisibleRef.current
    ) {
      console.log("Socket initialization skipped:", {
        isInitializingRef: isInitializingRef.current,
        isAuthenticated,
        isHidden: !isPageVisibleRef.current,
      });
      return;
    }

    if (socketRef.current) {
      console.log("Cleaning up existing socket connection");
      cleanupSocket();
    }

    if (!user || !userId) {
      console.error("User not authenticated", { user, userId });
      setConnectionError("User is not authenticated");
      return;
    }

    console.log("Starting socket initialization", { userId });
    isInitializingRef.current = true;
    setConnectionError(null);

    try {
      const newSocket = io(getSocketURL(), {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
        reconnectionDelay: INITIAL_RECONNECTION_DELAY,
        reconnectionDelayMax: RECONNECTION_DELAY,
        timeout: 20000,
        transports: ["websocket", "polling"],
        path: "/socket.io/",
        forceNew: true,
        autoConnect: true,
        upgrade: true,
        rememberUpgrade: true,
        rejectUnauthorized: false,
        // Add these options to improve performance
        perMessageDeflate: false,
        maxHttpBufferSize: 1e8,
        pingTimeout: 60000,
        pingInterval: 25000,
      });

      // Set up event listeners
      newSocket.on("connect", async () => {
        try {
          console.log(
            "Socket connection is working properly - Connection ID:",
            newSocket.id
          );
          setIsConnected(true);
          connectionAttemptsRef.current = 0;
          isInitializingRef.current = false;
          setConnectionError(null);

          // Join user's room for notifications
          await handleRoomJoin(newSocket, userId);
          // toast.success("Connected to real-time updates");

          // Start ping interval only if page is visible
          if (isPageVisibleRef.current) {
            startPingInterval();
          }

          // Verify room membership
          newSocket.emit("get_rooms", (rooms) => {
            if (!rooms?.includes(userId)) {
              console.warn("Room verification failed, attempting to rejoin...");
              handleRoomJoin(newSocket, userId).catch((error) => {
                console.error("Failed to rejoin room:", error);
                toast.error("Failed to join notification room");
              });
            }
          });
        } catch (error) {
          console.error("Error during connection setup:", error);
          setConnectionError(error.message);
          toast.error("Failed to setup real-time connection");
        }
      });

      newSocket.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error);
        setIsConnected(false);
        isInitializingRef.current = false;
        setConnectionError(error.message);

        if (error.message === "Authentication error: Invalid token") {
          console.error("Authentication error, redirecting to login...");
          window.location.href = "/login";
        } else if (isPageVisibleRef.current) {
          connectionAttemptsRef.current += 1;
          if (connectionAttemptsRef.current < MAX_RECONNECTION_ATTEMPTS) {
            const delay = Math.min(
              INITIAL_RECONNECTION_DELAY *
                Math.pow(2, connectionAttemptsRef.current - 1),
              RECONNECTION_DELAY
            );

            if (retryTimeoutRef.current) {
              clearTimeout(retryTimeoutRef.current);
            }
            retryTimeoutRef.current = setTimeout(() => {
              initializeSocket();
            }, delay);
          } else {
            console.error("Max reconnection attempts reached");
            setConnectionError(
              "Failed to establish connection after multiple attempts"
            );
            toast.error("Failed to connect to real-time updates");
            cleanupSocket();
          }
        }
      });

      newSocket.on("error", (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        isInitializingRef.current = false;
        setConnectionError(error.message);
        toast.error("Real-time connection error");
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Disconnected from WebSocket server:", reason);
        setIsConnected(false);
        isInitializingRef.current = false;
        setConnectionError(`Disconnected: ${reason}`);

        if (reason === "client namespace disconnect") {
          // The socket will automatically attempt to reconnect
        } else if (!isPageUnloading) {
          toast.custom(
            <div className="bg-yellow-400 text-black p-3 rounded">
              Disconnected from real-time updates
            </div>
          );
        }

        if (reason !== "io client disconnect" && isPageVisibleRef.current) {
          if (connectionAttemptsRef.current < MAX_RECONNECTION_ATTEMPTS) {
            const delay = Math.min(
              INITIAL_RECONNECTION_DELAY *
                Math.pow(2, connectionAttemptsRef.current),
              RECONNECTION_DELAY
            );

            if (retryTimeoutRef.current) {
              clearTimeout(retryTimeoutRef.current);
            }
            retryTimeoutRef.current = setTimeout(() => {
              initializeSocket();
            }, delay);
          }
        }
      });

      newSocket.on("reconnect_attempt", (attemptNumber) => {
        console.log(`Reconnection attempt ${attemptNumber}...`);
        const token = localStorage.getItem("token");
        if (token) {
          newSocket.auth = { token };
        }
        setConnectionError(`Reconnection attempt ${attemptNumber}...`);
        toastInfo(
          `Attempting to reconnect (${attemptNumber}/${MAX_RECONNECTION_ATTEMPTS})`
        );
      });

      newSocket.on("reconnect", async (attemptNumber) => {
        try {
          console.log(`Reconnected after ${attemptNumber} attempts`);
          setIsConnected(true);
          connectionAttemptsRef.current = 0;
          isInitializingRef.current = false;
          setConnectionError(null);
          toast.success("Reconnected to real-time updates");

          // Restart ping interval only if page is visible
          if (isPageVisibleRef.current) {
            startPingInterval();
          }

          if (userId) {
            await handleRoomJoin(newSocket, userId);
          }
        } catch (error) {
          console.error("Error during reconnection:", error);
          setConnectionError(error.message);
          toast.error("Failed to setup reconnection");
        }
      });

      newSocket.on("reconnect_error", (error) => {
        console.error("Reconnection error:", error);
        setConnectionError(`Reconnection error: ${error.message}`);
        toast.error("Failed to reconnect");
      });

      newSocket.on("reconnect_failed", () => {
        console.error("Failed to reconnect after all attempts");
        setConnectionError("Failed to reconnect after all attempts");
        toast.error("Failed to reconnect to real-time updates");
        cleanupSocket();
      });

      // Handle pong responses
      newSocket.on("client_pong", () => {
        // Connection is healthy
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    } catch (error) {
      console.error("Error creating socket connection:", error);
      isInitializingRef.current = false;
      setConnectionError(error.message);
      toast.error("Failed to establish real-time connection");
      cleanupSocket();
    }
  }, [
    cleanupSocket,
    handleRoomJoin,
    user,
    userId,
    startPingInterval,
    isAuthenticated,
  ]);

  useEffect(() => {
    if (!userId || !isAuthenticated) {
      cleanupSocket();
      return;
    }

    // Add a small delay before initializing socket to ensure server is ready
    const initTimeout = setTimeout(() => {
      initializeSocket();
    }, 1000);

    return () => {
      clearTimeout(initTimeout);
      cleanupSocket();
    };
  }, [initializeSocket, cleanupSocket, userId, isAuthenticated]);

  const value = {
    socket,
    isConnected,
    connectionError,
    isInitializing,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
