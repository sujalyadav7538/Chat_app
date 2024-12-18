import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";
import { createChatSlice } from "./slices/chat-slice.js";

export const userStore=create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a)
}));