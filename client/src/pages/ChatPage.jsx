import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import MessageThread from '../components/MessageThread';

function ChatPage() {
  const { user, logout } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="flex h-screen bg-[#F0F2F5] overflow-hidden">
      {/* Sidebar: full width on mobile when no chat open, fixed 1/3 width on desktop always */}
      <div
        className={`w-full md:w-1/3 bg-white flex-col border-r border-gray-200 ${
          selectedConversation ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="px-4 py-3 bg-[#F0F2F5] border-b border-gray-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#00A884] flex items-center justify-center text-white font-medium text-sm shrink-0">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <h2 className="font-medium text-[#111B21] truncate">{user?.username}</h2>
          </div>
          <button
            onClick={logout}
            className="text-sm text-[#667781] hover:text-[#00A884] transition-colors shrink-0"
          >
            Logout
          </button>
        </div>
        <Sidebar
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      </div>

      {/* Chat thread: hidden on mobile until a conversation is selected, always visible on desktop */}
      <div className={`w-full md:flex-1 flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
        {selectedConversation ? (
          <MessageThread
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <div className="flex-1 items-center justify-center text-[#667781] bg-[#F0F2F5] hidden md:flex">
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;