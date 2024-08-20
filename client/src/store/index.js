import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";

export const userStore=create()((...a)=>({
    ...createAuthSlice(...a),
}));