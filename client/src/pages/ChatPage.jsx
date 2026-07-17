import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/socketContext';
import { useEffect } from 'react';

function ChatPage() {
  const { user, logout } = useAuth();
  const {socket,onlineUsers} = useSocket();

  console.log('Current User:',user);
  
  useEffect(() => {
    if(socket) console.log('Socket connected:',socket.id);
  },[socket]);

  console.log('Online Users:',onlineUsers);

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default ChatPage;