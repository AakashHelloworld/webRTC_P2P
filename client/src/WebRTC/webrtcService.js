let peerConnection ;
const server = {
    iceServers: [
        {
            urls:['stun:stun1.1.google.com:19302', 
        'stun:stun2.1.google.com:19302']
        }
    ]
}

peerConnection = new RTCPeerConnection(server)

 const createoffer = async()=>{
    if(peerConnection){
        try{
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer)) 
    // console.log(offer)
    return offer  }
    catch(err){
        console.error('Failed to create and set local answer:', err);
        return null;
    }
}
} 

const getAnswer = async (offer) => {
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription((new RTCSessionDescription(answer)));
        
        return answer;
      } catch (error) {
        console.error('Failed to create and set local answer:', error);
        return null;
      }
    } else {
      console.error(
        'Not ready to create answer, current signaling state:',
        peerConnection.signalingState
      );
      return null;
    }
  };

  const setAnswertoLocalDescription = async (answer) => {
    if (peerConnection) {
      try {
        await peerConnection.setRemoteDescription(answer);
        console.log("Call Accepted 0")
        return true;
      } catch (error) {
        console.error('Failed to set remote answer:', error);
        return false;
      }
    } else {
      console.error(
        'Not ready to set remote answer, current signaling state:',
        peerConnection.signalingState
      );
      return false;
    }
  }



export {peerConnection, createoffer,getAnswer, setAnswertoLocalDescription}
