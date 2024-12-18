import { RiCloseFill } from "react-icons/ri";
import { userStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColors } from "@/utils/utilFunctions.js";
export const ChatHeader = () => {
  const { setSelectedChatType, selectedChatData, setSelectedChatData } =
    userStore();
  console.log(selectedChatData);
  return (
    <div className="border-b-2 h-[10vh] border-[#2f303b] flex  items-center  w-[100%] ">
      <div className="flex gap-3 px-10 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center ">
          <div className="w-10 h-10 relative">
            <Avatar
              className={`h-10 w-10 rounded-full overflow-hidden ${getColors(
                selectedChatData.color
              )} `}
            >
              {selectedChatData.image !== "" ? (
                <AvatarImage
                  src={selectedChatData.image}
                  alt="Profile"
                  className="object-cover w-full h-full bg-black rounded-full"
                />
              ) : (
                <div className="uppercase h-10 w-10 border-[1px] flex items-center justify-center rounded-full">
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.split("").shift()
                    : selectedChatData.email.split("").shift()}
                </div>
              )}
            </Avatar>
          </div>
          <div className="text-lg  poppins-medium ">
            {selectedChatData.firstName && selectedChatData.lastName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : ""}
          </div>
        </div>
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <RiCloseFill
            className="text-4xl "
            onClick={() => {
              setSelectedChatType("");
              setSelectedChatData(undefined);
            }}
          />
        </button>
      </div>
    </div>
  );
};
