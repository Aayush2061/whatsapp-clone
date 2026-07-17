import {createContext,useContext,useState,useEffect} from 'react';
import api from '../api/axios';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [accessToken,setAccessToken] = useState(null);
    const [loading,setLoading] = useState(true);  // true while we check for an existing session

  // On app load, try to silently restore session using the refresh cookie
    useEffect(() => {
        const tryRefresh = async () => {
            try{
                const res = await api.post('/auth/refresh');
                setAccessToken(res.data.accessToken);
                setUser(res.data.user);
            }catch(error){
                setUser(null);
                setAccessToken(null);
            }finally{
                setLoading(false);
            }
        };
        tryRefresh();
    },[]);

    const register = async(username,email,password) =>{
        const res = await api.post('/auth/register',{username,email,password});
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
    };

    const login = async(email,password) =>{
        const res = await api.post('/auth/login',{email,password});
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
    }

    const logout = async() =>{
        await api.post('/auth/logout');
        setUser(null);
        setAccessToken(null);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}   