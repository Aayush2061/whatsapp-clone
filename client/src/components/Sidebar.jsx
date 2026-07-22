import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Sidebar({ selectedConversation, setSelectedConversation }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      const res = await api.get('/conversations');
      setConversations(res.data);
    };
    fetchConversations();
  }, []);

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find((p) => p._id !== user.id);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => {
        const other = getOtherParticipant(conv);
        return (
          <div
            key={conv._id}
            onClick={() => setSelectedConversation(conv)}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${
              selectedConversation?._id === conv._id ? 'bg-gray-200' : ''
            }`}
          >
            <p className="font-medium">{other?.username}</p>
            <p className="text-sm text-gray-500 truncate">
              {conv.lastMessage?.content || 'No messages yet'}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;