"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
    const router = useRouter();
    const handleLogout = async()=>{
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.replace('/login');
    }
    useEffect(()=>{
        handleLogout();
    },[])
    return (
        <div className='w-full min-h-screen bg-gray-950 text-white'>
        Logging out.....
        </div>
    )
}

export default page
