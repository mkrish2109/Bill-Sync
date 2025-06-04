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
import { toast } from "react-toastify";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { user } = useAuth();
  const socketRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const connectionAttemptsRef = useRef(0);
  const isInitializingRef = useRef(false);
  const pingIntervalRef = useRef(null);
  const MAX_RECONNECTION_ATTEMPTS = 5;
  const RECONNECTION_DELAY = 5000;
  const INITIAL_RECONNECTION_DELAY = 1000;
  const PING_INTERVAL = 25000; // 25 seconds
  const userId = user?._id;

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

  const startPingInterval = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    pingIntervalRef.current = setInterval(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("client_ping");
      }
    }, PING_INTERVAL);
  }, []);

  const initializeSocket = useCallback(async () => {
    if (isInitializingRef.current) {
      return;
    }

    if (socketRef.current) {
      cleanupSocket();
    }

    const token = localStorage.getItem("token");
    if (!user || !userId) {
      console.error("User not authenticated");
      setConnectionError("User is not authenticated");
      localStorage.removeItem("token");
      return;
    }
    if (!token) {
      console.error("No valid authentication token found");
      setConnectionError("No valid authentication token found");
      localStorage.removeItem("token");
      return;
    }
    isInitializingRef.current = true;
    setConnectionError(null);

    try {
      const newSocket = io(getSocketURL(), {
        auth: {
          token: token,
        },
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
      });

      // Set up event listeners
      newSocket.on("connect", async () => {
        try {
          console.log("Socket connected successfully");
          setIsConnected(true);
          connectionAttemptsRef.current = 0;
          isInitializingRef.current = false;
          setConnectionError(null);

          // Join user's room for notifications
          await handleRoomJoin(newSocket, userId);
          // toast.success("Connected to real-time updates");

          // Start ping interval
          startPingInterval();

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
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
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
        } else {
          toast.warning("Disconnected from real-time updates");
        }

        if (reason !== "io client disconnect") {
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
        toast.info(
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

          // Restart ping interval
          startPingInterval();

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
  }, [cleanupSocket, handleRoomJoin, user, userId, startPingInterval]);

  useEffect(() => {
    if (!userId) {
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
  }, [initializeSocket, cleanupSocket, userId]);

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
