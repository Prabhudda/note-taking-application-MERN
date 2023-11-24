// WebSocketComponent.js
import { useEffect } from 'react';

const WebSocketComponent = () => {
  useEffect(() => {
    const socket = new WebSocket(
      'wss://note-taking-application-frontend.onrender.com:10000/ws'
    );

    socket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened:', event);
    });

    socket.addEventListener('message', (event) => {
      console.log('Message from server:', event.data);
      // Handle incoming messages from the server, e.g., update notes
    });

    socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed:', event);
    });

    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });

    return () => {
      socket.close();
    };
  }, []);

  return null; // This component doesn't render anything in the DOM
};

export default WebSocketComponent;
