import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const { user } = useAuth();
  const socketRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const connectionAttemptsRef = useRef(0);
  const isInitializingRef = useRef(false);
  const MAX_RECONNECTION_ATTEMPTS = 5;
  const RECONNECTION_DELAY = 5000;
  const INITIAL_RECONNECTION_DELAY = 1000;

  const cleanupSocket = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
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
  }, []);

  const handleRoomJoin = useCallback((socket, userId) => {
    return new Promise((resolve, reject) => {
      socket.emit('join_room', userId, (response) => {
        if (response?.success) {
          resolve(response);
        } else {
          reject(new Error(response?.error || 'Failed to join room'));
        }
      });
    });
  }, []);

  const initializeSocket = useCallback(async () => {
    if (isInitializingRef.current) {
      return;
    }

    if (socketRef.current) {
      cleanupSocket();
    }

    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    const userId = localStorage.getItem('userId');

    if (!token || (tokenExpiry && Date.now() > Number(tokenExpiry))) {
      setConnectionError('No valid authentication token found');
      if (tokenExpiry && Date.now() > Number(tokenExpiry)) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
      }
      return;
    }

    if (!userId) {
      setConnectionError('No user ID available');
      return;
    }

    isInitializingRef.current = true;
    setConnectionError(null);

    try {
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      auth: {
        token: token
      },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
        reconnectionDelay: INITIAL_RECONNECTION_DELAY,
        reconnectionDelayMax: RECONNECTION_DELAY,
      timeout: 20000,
        transports: ['websocket', 'polling'],
        path: '/socket.io/',
        forceNew: true,
        autoConnect: true
    });

    // Set up event listeners
      newSocket.on('connect', async () => {
        try {
      setIsConnected(true);
      connectionAttemptsRef.current = 0;
      isInitializingRef.current = false;
          setConnectionError(null);
      
      // Join user's room for notifications
          await handleRoomJoin(newSocket, userId);
          
          // Verify room membership
          newSocket.emit('get_rooms', (rooms) => {
            if (!rooms?.includes(userId)) {
              console.warn('Room verification failed, attempting to rejoin...');
              handleRoomJoin(newSocket, userId).catch(error => {
                console.error('Failed to rejoin room:', error);
              });
            }
          });
        } catch (error) {
          console.error('Error during connection setup:', error);
          setConnectionError(error.message);
        }
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
      isInitializingRef.current = false;
        setConnectionError(error.message);
      
      if (error.message === 'Authentication error: Invalid token') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        connectionAttemptsRef.current += 1;
        if (connectionAttemptsRef.current < MAX_RECONNECTION_ATTEMPTS) {
            // Exponential backoff for retry delay
            const delay = Math.min(
              INITIAL_RECONNECTION_DELAY * Math.pow(2, connectionAttemptsRef.current - 1),
              RECONNECTION_DELAY
            );
            
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }
          retryTimeoutRef.current = setTimeout(() => {
            initializeSocket();
            }, delay);
        } else {
          console.error('Max reconnection attempts reached');
            setConnectionError('Failed to establish connection after multiple attempts');
          cleanupSocket();
        }
      }
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      isInitializingRef.current = false;
        setConnectionError(error.message);
    });

    newSocket.on('disconnect', (reason) => {
        console.error('Disconnected from WebSocket server:', reason);
      setIsConnected(false);
      isInitializingRef.current = false;
        setConnectionError(`Disconnected: ${reason}`);
        
        // Attempt to reconnect if the disconnect was not initiated by the client
        if (reason !== 'io client disconnect') {
          if (connectionAttemptsRef.current < MAX_RECONNECTION_ATTEMPTS) {
            const delay = Math.min(
              INITIAL_RECONNECTION_DELAY * Math.pow(2, connectionAttemptsRef.current),
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

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      const token = localStorage.getItem('token');
      if (token) {
        newSocket.auth = { token };
      }
        setConnectionError(`Reconnection attempt ${attemptNumber}...`);
    });

      newSocket.on('reconnect', async (attemptNumber) => {
        try {
      setIsConnected(true);
      connectionAttemptsRef.current = 0;
      isInitializingRef.current = false;
          setConnectionError(null);
      
          if (userId) {
            await handleRoomJoin(newSocket, userId);
          }
        } catch (error) {
          console.error('Error during reconnection:', error);
          setConnectionError(error.message);
      }
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
    } catch (error) {
      console.error('Error creating socket connection:', error);
      isInitializingRef.current = false;
      setConnectionError(error.message);
      cleanupSocket();
    }
  }, [cleanupSocket, handleRoomJoin]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      cleanupSocket();
      return;
    }

    // Initialize socket when user data is available
    initializeSocket();

    // Cleanup on unmount
    return () => {
      cleanupSocket();
    };
  }, [initializeSocket, cleanupSocket]);

  const value = {
    socket,
    isConnected,
    connectionError
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 