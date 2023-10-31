import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSocket } from "../context/SocketProvider";
import {peerConnection, createoffer, getAnswer, setAnswertoLocalDescription} from "../WebRTC/webrtcService"
export const Room = () => {
    const [meroVideo, setmeroVideo] = useState()
    const [timroVideo, settimroVideo] = useState()
    const [otheruser, setOtheruser] = useState("");

    const socket = useSocket();
    const meroVideoRef = useRef();
    const timroVideoRef = useRef();

    const mySteamHandler = async () => {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
          setmeroVideo(stream);
        })
        .catch(err => console.error(err));
    }
    

    const createOfferHandler = async(id)=>{
      const offer = await createoffer();
      if(offer){
      socket.emit("call:sendoffer", {tonext:id, offer})
      }
    }

    const setLocalDescriptionofAnswer = async(answer)=>{
      const condition = await setAnswertoLocalDescription(answer);
      console.log("Call Accepted 1", condition)
    }

    const sendAnswer = async(from ,offer) => {
      console.log("I am creating Answer and sending to other user")
    if(offer){
    const Answer = await getAnswer(offer);
    if(Answer){
      console.log(Answer)
    socket.emit("call:sendAnswer", {tonext:from, Answer})
  }}
}

const sendStreams = async() => {
  console.log("Video i on", meroVideo)
  if (meroVideo) {
    console.log("mero VIDEO", meroVideo);
    for (const track of meroVideo.getTracks()) {
      console.log(track)
      peerConnection.addTrack(track, meroVideo);
    }
  }
};

    useEffect(() => {
      peerConnection.addEventListener("track", async (ev) => {
        const remoteStream = ev.streams;
        console.log("GOT TRACKS!!");
        console.log(remoteStream);
      });
    }, []);

    useEffect(()=>{
      mySteamHandler();
      socket.on("user:joined", ({name, id})=>{
        setOtheruser(id)
        createOfferHandler(id)
    },[socket])

    socket.on("collect:offer" ,({from , offer})=>{
      if(from && offer){
        console.log("I am getting offer")
        console.log(from)
        setOtheruser(from)
        sendAnswer(from ,offer)
      }
    })
    socket.on("collect:pleaseAcceptAnswer", ({from, Answer})=>{
      console.log(from, Answer)
      if(from && Answer){
        setLocalDescriptionofAnswer(Answer)
        console.log("Call Accepted 2")
        if(meroVideo){
        sendStreams()
        }
        
      }
    })

      socket.off("user:joined", ()=>{})
      socket.off("collect:offer", ()=>{})
      socket.off("collect:pleaseAcceptAnswer",({})=>{})

    }, [socket]);



    useEffect(() => {
        if (meroVideoRef.current && meroVideo) {
            meroVideoRef.current.srcObject = meroVideo;
        }
    }, [meroVideo]);

    useEffect(() => {
        if (timroVideoRef.current && timroVideo) {
          timroVideoRef.current.srcObject = timroVideo;
        }
    }, [timroVideo]);


  return (
    <div>Room { otheruser ? <h1>some one just connected: {otheruser}</h1>:<h1>No one is here</h1>}
    <h3>..................................</h3>
  {
    meroVideo &&<video
            ref={meroVideoRef} 
            data-testid="peer-video"
            style={{ width: "500px", height: '500px' }}
            autoPlay
            muted={true}
        />
  }  
  {
    timroVideo &&<video
            ref={timroVideoRef}
            data-testid="peer-video"
            style={{ width: "500px", height: '500px' }}
            autoPlay
            muted={true}
        />
  }
    </div>
  )
}
