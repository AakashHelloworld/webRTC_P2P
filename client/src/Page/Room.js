import React, { useEffect, useState, useRef } from 'react'
import { useSocket } from "../context/SocketProvider";
import {peerConnection, createoffer, getAnswer} from "../WebRTC/webrtcService"
export const Room = () => {
    const [meroVideo, setmeroVideo] = useState()
    const [otheruser, setOtheruser] = useState({
        name: "",
        id: ""
    });
    const socket = useSocket();
    const videoRef = useRef();

    const mySteamHandler = async() =>{
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setmeroVideo(stream)
    }

    const createOfferHandler = async(id)=>{
      const offer = await createoffer();
      if(offer){
        // console.log(offer)
      socket.emit("call:sendoffer", {tonext:id, offer})
      }
    }

    const collectOfferHandler = async(from ,offer)=>{
      if(offer){
      const answer = await getAnswer(offer);
      console.log(answer)
    }}
    useEffect(()=>{
      if(otheruser.id){
        createOfferHandler(otheruser.id)
      }
    },[otheruser])

    useEffect(()=>{
      mySteamHandler();
      socket.on("user:joined", ({name, id})=>{
        setOtheruser({name, id})
    })
    socket.on("collect:offer" ,({from , offer})=>{
      // console.log(from ,offer)
      if(from && offer){
      collectOfferHandler(from, offer);
      }
    })
    return(()=>{
      socket.off("user:joined", ()=>{})
      socket.off("collect:offer", ()=>{})
    })  
    }, [socket])

    useEffect(() => {
        if (videoRef.current && meroVideo) {
            videoRef.current.srcObject = meroVideo;
        }
    }, [meroVideo]);

  return (
    <div>Room { otheruser.id ? <h1>some one just connected: {otheruser.name}</h1>:<h1>No one is here</h1>}
    <h3>..................................</h3>
  {
    meroVideo &&<video
            ref={videoRef} 
            data-testid="peer-video"
            style={{ width: "500px", height: '500px' }}
            autoPlay
            muted={true}
        />
  }   
    </div>
  )
}
