import { ChatHeader } from "./component/chat-header"
import { Messagebar } from "./component/message-bar"
import { MessageContainer } from './component/message-container/index';

export const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-[100vh] w-[100%] flex-col flex bg-[#1c1d25] md:static md:flex-1 ">
      <ChatHeader/>
      <MessageContainer/>
      <Messagebar/>
    </div>
  )
}
