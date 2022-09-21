import React, { useState, useEffect, useCallback } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

export default function Chat({ socket, Username, Room}) {

    const [currentMessage, setcurrentMessage] = useState(""); 
    const [messageList, setmessageList] = useState([]);

    const sendMessage = async () => {

      if(currentMessage !== ""){

        const messageData = {
          Room: Room,
          Author: Username,
          message: currentMessage,
          time: new Date(Date.now()).getHours() + ":"
          + new Date(Date.now()).getMinutes()
        };

        await socket.emit("send_message", messageData);
        setmessageList((list) => [...list, messageData])
        setcurrentMessage('')

      }
      
    }

    const getmMsg = useCallback(() => {

      socket.on("receive_message", (data) => {
       console.log('this is the message sent',data)
       setmessageList((list) => [...list, data])
      })
     
   }, [socket])

    useEffect(() => {
      console.log('First Run')
    
      return () => {
        getmMsg()
      }
    }, [getmMsg])
    


    

  return (
    <div className='chat-window'>

       <div className='chat-header'>
        <p>Live Chat</p>
       </div>
       <div className='chat-body'>
       <ScrollToBottom className='message-container'>     
       {messageList.map((messageContent) => {
            return (
              <div
                className="message" key={messageContent.message} id={Username === messageContent.Author ? "you" : "other"}>
                <div>
                  <div className="message-content" >
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.Author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
       </div>
       <div className='chat-footer'>

           <input type='text' 
           value={currentMessage}
           placeholder='Hey.....' 
           onChange={(event) => { setcurrentMessage(event.target.value)}}
           onKeyDown={(event) => {event.key ==="Enter" && sendMessage()}}/>
           <button onClick={sendMessage}>&#9658;</button>

       </div>

    </div>
  )
}
