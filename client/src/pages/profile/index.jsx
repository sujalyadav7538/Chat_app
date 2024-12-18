/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { userStore } from "@/store";
import { AvatarImage } from "@radix-ui/react-avatar";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { colors, getColors } from "@/utils/utilFunctions.js";

export const Profile = () => {
  const { userinfo, setUserInfo } = userStore();
  const [hovered, setHovered] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    image: "",
    color: 0,
  });
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userinfo.profileSetup === true) {
      setUser({
        firstName: userinfo.firstName,
        lastName: userinfo.lastName,
        image: userinfo.image,
        color: userinfo.color,
      });
    }
  }, [userinfo]);

  const shouldNotCall = () => {
    console.log("here");
    if (
      userinfo.firstName === user.firstName &&
      userinfo.lastName === user.lastName &&
      userinfo.color === user.color &&
      user.image === userinfo.image
    )
      return true;
    return false;
  };

  const handleSubmit = async () => {
    if (shouldNotCall()) return;
    if (user.firstName.trim().length <= 3) {
      toast.error("First Name is required");
      return;
    }
    if (user.lastName.trim().length <= 3) {
      toast.error("Last Name is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:8747/user/setUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      setUserInfo(data);
      toast.success("Profile Updated Successfully!");
      navigate("/chat");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNavigate = () => {
    navigate("/chat");
  };

  const handleImage = async (e) => {
    try {
      setLoading(true)
      const file = e.target.files[0];
      if (!file) {
        toast.error("No file selected");
        return;
      }

      const profile_image = new FormData();
      profile_image.append("profile_image", file);
      const response = await fetch(
        "http://localhost:8747/user/profile/upload",
        {
          method: "POST",
          body: profile_image,
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      setUser((prev) => ({ ...prev, image: data.url }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(error.message || "Error uploading image");
    } finally{
      setLoading(false)
    }
  };

  const handleUserAttributes = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (index) => {
    setUser((prev) => ({ ...prev, color: index }));
  };

  const deleteImage=async()=>{
    try {
      setLoading(true);
      const response=await fetch('http://localhost:8747/user/removeimage',{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        credentials:"include",
      });
      const data=await response.json();
      if(data.success==false) return toast.error(data.message);
      setUser(prev=>({...prev,image:""}));
      setUserInfo(data)
      toast.message("Image Deleted Successfully!!")
    } catch (error) {
      toast.error('NO image found');
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vh] md:w-max">
        <div>
          <IoArrowBack
            className="text-white text-4xl lg:text-6xl cursor-pointer"
            onClick={handleNavigate}
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar
              className={`h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden ${getColors(
                user.color
              )}`}
            >
              {user.image ? (
                <AvatarImage
                  src={user.image}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className="uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full">
                  {user.firstName
                    ? user.firstName.charAt(0)
                    : userinfo.email.charAt(0)}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full">
                {user.image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" onClick={deleteImage} disabled={loading}/>
                ) : (
                  <>
                    <FaPlus
                      className="text-white text-3xl cursor-pointer"
                      onClick={() => fileInputRef.current.click()}
                      
                    />
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImage}
                      accept=".png,.jpg,.jpeg"
                      disabled={loading}
                    />
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col text-white items-center justify-center gap-5">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userinfo.email}
                className={`rounded-lg p-6 bg-[#2c2e3b] border-none ${
                  colors[user.color]
                } outline outline-2`}
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="First Name"
                type="text"
                value={user.firstName}
                className={`rounded-lg p-6 bg-[#2c2e3b] border-none ${
                  colors[user.color]
                } outline outline-2`}
                onChange={handleUserAttributes}
                name="firstName"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                value={user.lastName}
                className={`rounded-lg p-6 bg-[#2c2e3b] border-none ${
                  colors[user.color]
                } outline outline-2`}
                onChange={handleUserAttributes}
                name="lastName"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((clr, index) => (
                <div
                  key={index}
                  className={`${getColors(
                    index
                  )} rounded-full h-8 w-8 cursor-pointer transition-all duration-300 ${
                    index === user.color
                      ? "outline outline-white outline-2"
                      : ""
                  }`}
                  onClick={() => handleColorChange(index)}
                />
              ))}
            </div>
          </div>
        </div>
        <div>
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={handleSubmit}
            disabled={loading}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
