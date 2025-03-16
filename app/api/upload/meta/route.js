import Meme from "@/models/meme";
import { NextResponse } from "next/server";
import jsonwebtoken from 'jsonwebtoken';
import User from "@/models/user";
import connectToDB from "@/lib/db";

export const POST = async(req)=>{
    try {
        connectToDB();
        const body = await req.json();
        if(!body.token){
            return NextResponse.json({err: "Unauthorised Access"},{status: 200});
        }
        const {email} = jsonwebtoken.decode(body.token,process.env.JWTSECRET);
        const userData = await User.findOne({email});
        if(!userData){
            return NextResponse.json({err: "Unauthorised Access"},{status: 200});
        }
        if(!body.imageurl){
            return NextResponse.json({err: "Image Upload Error"},{status: 200});
        }
        const caption = body.caption || '';
        await Meme.create({imageUrl: body.imageurl, uploader: userData._id, uploaderName: userData.name, caption});
        return NextResponse.json({msg: "Meme Uploaded Successfully"});
    } catch (error) {
        console.error(error);
        return NextResponse.json({err: "Internal Server Error"},{status: 500});
    }
}