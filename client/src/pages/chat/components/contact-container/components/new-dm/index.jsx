/* eslint-disable no-undef */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { FaPlus } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColors } from "@/utils/utilFunctions.js";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { userStore } from "@/store";

export const NewDM = () => {
  const {setSelectedChatType , setSelectedChatData}=userStore()
  const [openNewContact, setopenNewContact] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const handleContacts = async (searchTerm) => {
    try {
      if (!searchTerm) return setSearchedContacts([]);
      const response = await fetch("http://localhost:8747/contact/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.success == false) return toast.error(data.message);
      if (data.contacts.length == 0) return toast.message("No Contact Found!");
      setSearchedContacts(data.contacts);
    } catch (error) {
      setSearchedContacts([]);
      toast.error(error.message);
    }
  };
  const selectContact=(contacts)=>{
    setopenNewContact(false);
    setSelectedChatData(contacts)
    setSelectedChatType('contact')
    setSearchedContacts([])
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setopenNewContact(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContact} onOpenChange={setopenNewContact}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>Please Select the Contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <Input
              className="rounded-lg p-6 bg-[#2c2e3b] border-none "
              placeholder="Search Contacts"
              onChange={(e) => handleContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px] w-full font-serif">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-5 items-center cursor-pointer"
                  onClick={()=>selectContact(contact)}
                > 
                  <div className="w-12 h-12 relative">
                    <Avatar
                      className={`h-12 w-12 rounded-full overflow-hidden ${getColors(
                        contact.color
                      )} `}
                    >
                      {contact.image !== "" ? (
                        <AvatarImage
                          src={contact.image}
                          alt="Profile"
                          className="object-cover w-full h-full bg-black rounded-full"
                        />
                      ) : (
                        <div className="uppercase h-12 w-12 border-[1px] flex items-center justify-center rounded-full">
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email}
                    </span>
                    <span className="text-xs">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {searchedContacts.length <= 0 && (
            <div className="flex-1  md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="flex text-opacity-80 text-white flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                  Hi <span className="text-purple-500">!</span> Search
                  <span className=" text-purple-500 "> New Contact</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
