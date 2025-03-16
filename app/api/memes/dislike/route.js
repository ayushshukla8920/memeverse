import connectToDB from "@/lib/db"
import { NextResponse } from "next/server"
import jsonwebtoken from "jsonwebtoken";
import Meme from "@/models/meme";
import User from "@/models/user";

export const POST = async(req)=>{
    connectToDB();
    const {token, id} = await req.json();
    const {email} = jsonwebtoken.decode(token,process.env.JWTSECRET);
    const memeresponse = await Meme.findOne({_id: id});
    memeresponse.likes = memeresponse.likes - 1;
    await memeresponse.save();
    return NextResponse.json({msg: "Likes Added"});
}