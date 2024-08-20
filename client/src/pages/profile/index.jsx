/* eslint-disable no-unused-vars */
import { userStore } from '@/store'
import React from 'react'

export const Profile = () => {
  const userinfo = userStore((state) => state.userinfo)
  return (
    <div>hello,{userinfo.email}</div>
  )
}
