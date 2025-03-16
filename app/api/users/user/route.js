import { NextResponse } from 'next/server';
import user from '@/models/user';
import jsonwebtoken from 'jsonwebtoken';

export const POST = async(req)=>{
    try {
        const body = await req.json();
        if(!body.token){
            return NextResponse.json({error: "UnAuthorised Access"});
        }
        const {email} = jsonwebtoken.decode(body.token,process.env.JWTSECRET);
        const response = await user.find({email}).select("-password");
        return NextResponse.json(response[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({err: "Internal Server Error"},{status: 500});
    }
}