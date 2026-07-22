import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import MessageThread from '../components/MessageThread';

function ChatPage() {
  const { user, logout } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="flex h-screen bg-[#F0F2F5]">
      <div className="w-1/3 bg-white flex flex-col border-r border-gray-200">
        <div className="px-4 py-3 bg-[#F0F2F5] border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00A884] flex items-center justify-center text-white font-medium text-sm">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <h2 className="font-medium text-[#111B21]">{user?.username}</h2>
          </div>
          <button
            onClick={logout}
            className="text-sm text-[#667781] hover:text-[#00A884] transition-colors"
          >
            Logout
          </button>
        </div>
        <Sidebar
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <MessageThread conversation={selectedConversation} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#667781] bg-[#F0F2F5]">
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;