/* eslint-disable no-unused-vars */
import { GrAttachment } from "react-icons/gr";
import { useEffect, useRef, useState } from "react";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";

export const Messagebar = () => {
  const emojiRef=useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerState, setEmojiPickerState] = useState(false);
  const handleEmoji=(emoji)=>{
    setMessage((mssg)=>(mssg+emoji.emoji));
  };
  useEffect(()=>{
    function handleEmojiClose(event){
      if(emojiRef.current&&!emojiRef.current.contains(event.target)){
        setEmojiPickerState(false)
      }
    }
    document.addEventListener('mousedown',handleEmojiClose);
    return ()=> document.removeEventListener('mousedown',handleEmojiClose)
  },[emojiRef]);
  const handleMessage = () => {};
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex flex-1 rounded-md items-center gap-5 pr-5 bg-[#2a2b33]">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          onChange={(e) => setMessage(e.target.value)}
          defaultValue={message}
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-3xl" />
        </button>
        <div className="relative" ref={emojiRef}>
          <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={()=>setEmojiPickerState(prev=>!prev)}>
            <RiEmojiStickerLine className="text-3xl" />
          </button>
          <div className="absolute bottom-16 right-0 " >
            <EmojiPicker theme='dark' onEmojiClick={handleEmoji} autoFocusSearch={false} open={emojiPickerState}/>
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};
