/* eslint-disable no-unused-vars */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { userStore } from "@/store/index";
import { getColors } from "@/utils/utilFunctions.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const ProfileInfo = () => {
  const { userinfo , setUserInfo } = userStore();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      const response = await fetch("http://localhost:8747/user/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data=await response.json();
      if(data.success==false) toast.error(data.message);
      setUserInfo(null);
      navigate('/auth');

    } catch (error) {
      toast.error("error.message");
    }
  };
  return (
    <div className={`absolute bottom-0 h-16  flex items-center justify-between px-6 w-full bg-[#1c1b1e] hover:shadow-innerWhite`}>
      <div className="flex gap-3 items-center justify-center ">
        <div className="w-10 h-10 relative">
          <Avatar
            className={`h-10 w-10 rounded-full overflow-hidden ${getColors(
              userinfo.color
            )} `}
          >
            {userinfo.image !== "" ? (
              <AvatarImage
                src={userinfo.image}
                alt="Profile"
                className="object-cover w-full h-full bg-black rounded-full"
              />
            ) : (
              <div className="uppercase h-10 w-10 border-[1px] flex items-center justify-center rounded-full">
                {userinfo.firstName
                  ? userinfo.firstName.split("").shift()
                  : userinfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="text-lg  poppins-medium ">
          {userinfo.firstName && userinfo.lastName
            ? `${userinfo.firstName} ${userinfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-purple-500 text-xl font-medium "
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-red-500 text-xl font-medium "
                onClick={handleLogOut}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
              Logout
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
