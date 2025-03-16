import { NextResponse } from "next/server"
import user from '@/models/user';
import jsonwebtoken from "jsonwebtoken";
import connectToDB from "@/lib/db";


export const GET = async(req, {params})=>{
    connectToDB();
    const {token} = await params;
    const AuthData = jsonwebtoken.decode(token,process.env.JWTSECRET);
    const updatedUser = await user.findOneAndUpdate(
        { email: AuthData.email },
        {
            email: AuthData.email,
            name: AuthData.name, 
            profilePic: AuthData.image 
        },
        { new: true, upsert: true }
    );
    const redirectUrl = `${process.env.NEXTAUTH_URL}/google/${token}`
    return NextResponse.redirect(redirectUrl);
}