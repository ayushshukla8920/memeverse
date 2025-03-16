import { NextResponse } from 'next/server';
import user from '@/models/user';
import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import connectToDB from "@/lib/db";

export const POST = async(req)=>{
    try {
        connectToDB();
        const body = await req.json();
        if(!body.name || !body.email || !body.password){
            return NextResponse.json({err: "All fields are Required"},{status: 200});
        }
        const response = await user.find({email: body.email});
        if(response.length > 0){
            return NextResponse.json({err: "Account already exists"},{status: 200});
        }
        const hashed_pw = bcryptjs.hashSync(body.password,10);
        await user.create({name: body.name, email: body.email, password: hashed_pw});
        const token = jsonwebtoken.sign({email: body.email},process.env.JWTSECRET);
        return NextResponse.json({msg: "Registration Successful", token},{status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({err: "Internal Server Error"},{status: 500});
    }
}