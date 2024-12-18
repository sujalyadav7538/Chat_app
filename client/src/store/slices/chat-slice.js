/* eslint-disable no-unused-vars */
export const createChatSlice=(set,get)=>({
    selectedChatType:"",
    selectedChatData:undefined,
    selectedChatMessage:[],
    setSelectedChatType:(selectedChatType)=>set({selectedChatType}),
    setSelectedChatData:(selectedChatData)=>set({selectedChatData}),
    setSelectedChatMessage:(selectedChatMessage)=>set({selectedChatMessage}),
    closeChat:()=>({
        selectedChatType:undefined,
        selectedChatData:undefined,
        selectedChatMessage:[],
    })
})