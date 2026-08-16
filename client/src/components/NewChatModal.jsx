import { useState } from 'react';
import api from '../api/axios';

function NewChatModal({ onClose, onConversationStarted }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/users/search?query=${value}`);
      setResults(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (userId) => {
    const res = await api.post('/conversations', { userId });
    onConversationStarted(res.data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-medium text-[#111B21]">New chat</h2>
          <button onClick={onClose} className="text-[#667781] hover:text-[#111B21]">✕</button>
        </div>

        <div className="p-4">
          <input
            autoFocus
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by username"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#00A884] focus:ring-1 focus:ring-[#00A884]"
          />
        </div>

        <div className="max-h-64 overflow-y-auto">
          {loading && <p className="text-center text-sm text-[#667781] py-4">Searching...</p>}

          {!loading && query && results.length === 0 && (
            <p className="text-center text-sm text-[#667781] py-4">No users found</p>
          )}

          {results.map((u) => (
            <div
              key={u._id}
              onClick={() => handleSelectUser(u._id)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
            >
              <div className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center text-white font-medium text-sm">
                {u.username[0].toUpperCase()}
              </div>
              <span className="text-sm text-[#111B21]">{u.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewChatModal;