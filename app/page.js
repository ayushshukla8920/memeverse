"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegSquarePlus } from "react-icons/fa6";
import { IoOptions, IoHomeOutline } from "react-icons/io5";
import MemeFeed from "@/components/MemeFeed";

const Page = () => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("token="));
    if (tokenCookie) {
      setToken(tokenCookie.split("=")[1]);
    } else {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const handleUserFetch = async () => {
      try {
        const res = await fetch(`/api/users/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    handleUserFetch();
  }, [token]);

  if (!userData) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b to-[#450F28] from-[#151721] flex flex-col text-white">
      {/* Header */}
      <div className="w-full h-[12vh] flex items-center justify-between px-6 md:px-10 fixed top-0 bg-[#151721] z-10">
        <h1 className="text-white font-bold text-3xl md:text-4xl">memeVerse</h1>
        <img className="w-10 h-10 rounded-full" src={userData.profilePic} alt="User Profile" />
      </div>

      {/* Meme Feed Section */}
      <div className="w-full flex-grow overflow-y-auto mt-[12vh] mb-[10vh]">
        <MemeFeed />
      </div>

      {/* Bottom Navigation */}
      <div className="h-[10vh] w-full bg-black/50 flex justify-evenly items-center fixed bottom-0 z-10">
        <a href="/" className="text-4xl">
          <IoHomeOutline />
        </a>
        <a href="/create" className="text-4xl text-gray-500">
          <FaRegSquarePlus />
        </a>
        <a href="/preferences" className="text-4xl text-gray-500">
          <IoOptions />
        </a>
      </div>
    </div>
  );
};

export default Page;
