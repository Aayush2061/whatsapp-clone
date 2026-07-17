import {Routes,Route,Navigate} from 'react-router-dom'
import {useAuth} from './context/AuthContext'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';

function App(){
  const {user,loading} = useAuth();

  if(loading){
    return <div>Loading...</div> // waiting on the silent refresh check
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
      <Route path="/" element={user ? <ChatPage /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App;