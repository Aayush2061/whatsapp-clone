import { createContext, useContext, useEffect, useState } from 'react';
import {io} from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children}) => {
    const {user} = useAuth();
    const [socket,setSocket] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);

    // Not logged in — make sure any existing socket is cleaned up

    useEffect(()=>{
        if(!user){
            // Not logged in — make sure any existing socket is cleaned up
            if(socket){
                socket.close();
                setSocket(null);
            }
            return;
        }

        const newSocket = io('http://localhost:5000', {
            query: { userId: user?.id},
        })
    
        setSocket(newSocket);
    
        newSocket.on('getOnlineUsers', (users) => {
            setOnlineUsers(users);
        });
    
        //Cleanup when user logs out or component unmounts
        return () => newSocket.close();
    },[user]); //reconnect everytime the logged in user changes 

    return (
        <SocketContext.Provider value={{socket,onlineUsers }} >
            {children}
        </SocketContext.Provider>
    );
};