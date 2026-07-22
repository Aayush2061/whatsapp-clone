import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import MessageThread from '../components/MessageThread';

function ChatPage() {
  const { user, logout } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">{user?.username}</h2>
          <button onClick={logout} className="text-sm text-red-500">Logout</button>
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
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;