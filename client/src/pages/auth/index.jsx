/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import Victory from "@/assets/victory.svg";
import Background from "@/assets/login2.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import {useNavigate } from "react-router-dom";
import { userStore } from "@/store";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate=useNavigate();
  const {setUserInfo}=userStore();
  

  const validateSignup=()=>{
    if(!email.length){
      toast.error('Email is required!');
      return false;
    }
    if(!password.length){
      toast.error('Password is required!');
      return false;
    }
    if(password.length){
      if(!confirmPassword.length){
        toast.error('Enter ConfirmPassword!');
        return false;
      }
      else if(confirmPassword!=password){
        toast.error('Wrong Password!!');
        setPassword('')
        setConfirmPassword('')
        return false;
      }
    }

    return true;

  }

  const handleSingup=async()=>{
   try {
     if(validateSignup()){
       const response=await fetch('http://localhost:8747/auth/singup',{
         method:'POST',
         headers:{
           'Content-Type':'application/json',
         },
         body:JSON.stringify({email,password}),
         credentials:"include"             
       });
       const data=await response.json();
 
       if(data.success==false) return console.log(data.message);
       setUserInfo(data)
       navigate('/profile');
       
      }
    } catch (error) {
     toast.error(error.message)
    }
  };

  const handleLogin = async () => {
    try {
      if (!email.length) {
        toast.error('Email is required!');
        return false;
      }
      if (!password.length) {
        toast.error('Password is required!');
        return false;
      }
  
      const response = await fetch("http://localhost:8747/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
  
      if (!response.ok) {
        toast.error("Failed to login. Please try again.");
        return false;
      }
  
      const data = await response.json();
  
      if (data.success === false) {
        return false;
      } else {
        setUserInfo(data);
        if (data.profileSetup) {
          navigate('/chat');
        } else {
          navigate('/profile');
        }
        return true;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };
  
  
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] w-[80vw] bg-white border-2  border-white text-opacity-90 shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] grid xl:grid-cols-2 rounded-3xl">
        <div className="flex flex-col items-center justify-center gp-10">
          <div className="flex  flex-col items-center justify-center">
            <div className="flex justify-center items-center">
              <h1 className="text-5xl font-bold lg:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">Fill The Form </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black
                text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black
                text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  SingUp
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="rounded-full  p-6" onClick={handleLogin}>Login</Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 mt-10" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                                <Button className="rounded-full  p-6" onClick={handleSingup} >Sign UP</Button>

              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="" className="h-[500px]"/>
        </div>
      </div>
    </div>
  );
};

export default Auth;
