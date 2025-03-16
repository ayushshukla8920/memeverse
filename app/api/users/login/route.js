import { NextResponse } from 'next/server';
import user from '@/models/user';
import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import connectToDB from "@/lib/db";

export const POST = async(req)=>{
    try {
        connectToDB();
        const body = await req.json();
        if(!body.email || !body.password){
            return NextResponse.json({err: "Email and Password is Required"},{status: 200});
        }
        const response = await user.find({email: body.email});
        if(response.length == 0){
            return NextResponse.json({err: "Invalid Email"},{status: 200});
        }
        const valid = bcryptjs.compareSync(body.password,response[0].password);
        if(valid == false){
            return NextResponse.json({err: "Invalid Password"},{status: 200});
        }
        const token = jsonwebtoken.sign({email: body.email},process.env.JWTSECRET);
        return NextResponse.json({msg: "Login Success", token},{status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({err: "Internal Server Error"},{status: 500});
    }
}