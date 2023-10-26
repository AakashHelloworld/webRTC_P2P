import React, { useEffect, useState } from 'react'
import { useSocket } from "../context/SocketProvider";

export const Room = () => {
    const [otheruser, setOtheruser] = useState({
        name: "",
        id: ""
    });
    const socket = useSocket();
    useEffect(()=>{
            socket.on("user:joined", ({name, id})=>{
                setOtheruser({name, id})
            })
    }, [socket])




  return (
    <div>Room { otheruser.id ? <h1>some one just connected: {otheruser.name}</h1>:<h1>No one is here</h1>}
    <h3>..................................</h3>
    <video
            data-testid="peer-video"
            style={{ width: "100%" }}
            ref={videoRef}
            autoPlay
            muted={true}
        />

    <video></video>
    
    
    
    
    </div>
  )
}
