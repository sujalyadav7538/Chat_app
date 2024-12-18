/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { userStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ChatContainer } from './components/chat-container';
import { ContactContainer } from './components/contact-container';
import { EmptyChatContainer } from './components/empty-chat-container';

export  const Chat = () => {
  const { userinfo,selectedChatType}=userStore();
  const navigate=useNavigate();
  useEffect(() => {
   if(userinfo!==undefined && !userinfo.profileSetup){
    toast('Please Setup Profile To continue!!')
    navigate('/profile');
   }
  }, [userinfo]);

  
  return (
    <div className='flex h-[100vh] text-white overflow-hidden'>
      <ContactContainer/>
      {selectedChatType===""?<EmptyChatContainer/>:<ChatContainer/>}
      
    </div>
  )
}
