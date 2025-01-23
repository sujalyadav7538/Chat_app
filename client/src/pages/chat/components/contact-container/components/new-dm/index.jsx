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
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColors } from "@/utils/utilFunctions.js";
import { toast } from "sonner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { userStore } from "@/store";

export const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData,setSelectedChatMessage } = userStore();
  const [openNewContact, setOpenNewContact] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedContacts, setSearchedContacts] = useState([]);

  // Debounced search effect to limit API calls
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm) {
        handleContacts(searchTerm);
      } else {
        setSearchedContacts([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const handleContacts = async (searchTerm) => {
    try {
      const response = await fetch("http://localhost:8747/contact/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.contacts.length === 0) {
        toast.message("No Contact Found!");
        setSearchedContacts([]);
      } else {
        setSearchedContacts(data.contacts);
      }
    } catch (error) {
      toast.error("Failed to fetch contacts. Please try again.");
      setSearchedContacts([]);
    }
  };

  const selectContact = (contact) => {
    setOpenNewContact(false);
    setSelectedChatData(contact);
    setSelectedChatType("contact");
    setSearchedContacts([]);
    setSelectedChatMessage([])
    setSearchTerm(""); // Reset search field
  };

  const handleDialogClose = (isOpen) => {
    setOpenNewContact(isOpen);
    if (!isOpen) {
      setSearchedContacts([]);
      setSearchTerm("");
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContact(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContact} onOpenChange={handleDialogClose}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>Please Select a Contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <Input
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              placeholder="Search Contacts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px] w-full font-serif">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-5 items-center cursor-pointer"
                  onClick={() => selectContact(contact)}
                >
                  <Avatar
                    className={`h-12 w-12 rounded-full overflow-hidden ${getColors(
                      contact.color
                    )}`}
                  >
                    {contact.image ? (
                      <AvatarImage
                        src={contact.image}
                        alt="Profile"
                        className="object-cover w-full h-full bg-black rounded-full"
                      />
                    ) : (
                      <div className="uppercase h-12 w-12 border-[1px] flex items-center justify-center rounded-full">
                        {contact.firstName
                          ? contact.firstName.charAt(0)
                          : contact.email.charAt(0)}
                      </div>
                    )}
                  </Avatar>
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
          {searchedContacts.length === 0 && (
            <div className="flex-1 flex flex-col justify-center items-center">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl text-center">
                <h3>
                  Hi <span className="text-purple-500">!</span> Search
                  <span className=" text-purple-500"> New Contact</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
