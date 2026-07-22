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
  <div className="flex flex-col h-full bg-[#F0F2F5]">
    <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-[#00A884] flex items-center justify-center text-white font-medium text-sm">
        {otherUser?.username?.[0]?.toUpperCase()}
      </div>
      <span className="font-medium text-[#111B21]">{otherUser?.username}</span>
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`flex ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`px-3 py-2 rounded-lg max-w-xs text-sm shadow-sm ${
              msg.sender._id === user.id
                ? 'bg-[#D9FDD3] text-[#111B21]'
                : 'bg-white text-[#111B21]'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#00A884] bg-[#F0F2F5]"
      />
      <button
        type="submit"
        className="bg-[#00A884] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#008f6f] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      </button>
    </form>
  </div>
);
}

export default MessageThread;