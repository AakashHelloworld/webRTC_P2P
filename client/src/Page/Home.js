import React, { useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import { useNavigate } from "react-router-dom";


export const Home = () => {
    const socket = useSocket();
    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [roomId, setRoomId] = useState("")


    const submitHandler = (e)=>{
        e.preventDefault();
        if(!name || !roomId) return;
        // console.log(name, roomId)
        socket.emit("send-userId-roomid", {name, roomId})
    }


    useEffect(()=>{
   
        socket.on("room:join" , ({name, roomId})=>{
            navigate(`/room/${roomId}`);            
        })
        return(()=>{
            socket.off("room:join" , ({name, roomId})=>{})
        })
    }, [socket])

  return (
    <div>
            <form onSubmit={submitHandler} >
                <input type='text' value={name} onChange={(e)=>setName(e.target.value)}/>
                <input type='number' value={roomId} onChange={(e)=>setRoomId(e.target.value)}/>
                <button type='submit'>Click me</button>
            </form>
    </div>
  )
}



