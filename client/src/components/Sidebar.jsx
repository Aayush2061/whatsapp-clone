import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import NewChatModal from './NewChatModal';

function Sidebar({ selectedConversation, setSelectedConversation }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);

  const fetchConversations = async () => {
    const res = await api.get('/conversations');
    setConversations(res.data);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Keep the sidebar live: update previews, reorder, and un-hide on any new message
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c._id === message.conversationId);

        if (existingIndex !== -1) {
          // Conversation already in our list — update its lastMessage and move it to the top
          const updated = [...prev];
          const [conv] = updated.splice(existingIndex, 1);
          conv.lastMessage = message;
          return [conv, ...updated];
        }

        // Conversation not in our list at all (e.g., brand new, or was hidden) — refetch fully
        fetchConversations();
        return prev;
      });
    };

    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket]);

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find((p) => p._id !== user.id);
  };

  const handleConversationStarted = (conversation) => {
    setConversations((prev) => {
      const exists = prev.find((c) => c._id === conversation._id);
      if (exists) return prev;
      return [conversation, ...prev];
    });
    setSelectedConversation(conversation);
  };

  const handleDelete = async (e, conversationId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this chat? It will reappear if they message you again.')) return;

    await api.delete(`/conversations/${conversationId}`);
    setConversations((prev) => prev.filter((c) => c._id !== conversationId));

    if (selectedConversation?._id === conversationId) {
      setSelectedConversation(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b border-gray-100">
        <button
          onClick={() => setShowNewChat(true)}
          className="w-full text-sm text-[#00A884] font-medium py-1.5 hover:bg-gray-50 rounded"
        >
          + New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const other = getOtherParticipant(conv);
          const isActive = selectedConversation?._id === conv._id;
          return (
            <div
              key={conv._id}
              onClick={() => setSelectedConversation(conv)}
              className={`group flex items-center gap-3 px-4 py-3 cursor-pointer border-l-[3px] transition-colors ${
                isActive ? 'bg-[#F0F2F5] border-l-[#00A884]' : 'border-l-transparent hover:bg-gray-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center text-white font-medium text-sm shrink-0">
                {other?.username?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#111B21] text-sm truncate">{other?.username}</p>
                <p className="text-xs text-[#667781] truncate">
                  {conv.lastMessage?.content || 'No messages yet'}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(e, conv._id)}
                className="opacity-0 group-hover:opacity-100 text-[#667781] hover:text-red-500 transition-opacity px-1"
                title="Delete chat"
              >
                🗑
              </button>
            </div>
          );
        })}
      </div>

      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onConversationStarted={handleConversationStarted}
        />
      )}
    </div>
  );
}

export default Sidebar;