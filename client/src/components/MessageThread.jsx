import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

function MessageThread({ conversation }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const otherUser = conversation.participants.find((p) => p._id !== user.id);

  //Fetch message history whenever the selected conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await api.get(`/messages/${conversation._id}`);
      setMessages(res.data);
    }
    fetchMessages();
  },[conversation._id])

  //Listen for real-time incoming messages via socket.io
  useEffect(() => {
    if(!socket) return;

    const handleNewMessage = (message) => {
      // Only add it if it belongs to the conversation currently open
      if(message.conversationId === conversation._id){
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    socket.on('newMessage',handleNewMessage);
    return () => socket.off('newMessage',handleNewMessage);

    },[conversation._id, socket]);

    //Auto-scroll to the bottom of the message thread when new messages arrive
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
      e.preventDefault();
      if(!newMessage.trim()) return;

      const res = await api.post('/messages',{
        conversationId:conversation._id,
        content:newMessage,
      })

      setMessages((prev) => [...prev,res.data]); //show our own message immediately
      setNewMessage('');
    }

 return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b font-semibold">{otherUser?.username}</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.sender._id === user.id ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
}

export default MessageThread;