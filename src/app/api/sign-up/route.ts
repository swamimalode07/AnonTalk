import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request){
    await dbConnect()
    try {
        const {username,email, password}=await request.json()
        const existingUserVerifiedByUsername= await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{status:400}) 
        }
        const existinguserbyemail= await UserModel.findOne({email})
        const verifyCode=Math.floor(100000+Math.random()*900000).toString()

        if(existinguserbyemail){
            if(existinguserbyemail.isVerified){
                return Response.json({
                    success:false,
                    message:"User with this Email already exists"
                },{status:400})
            }{
                const hashedPassword=await bcrypt.hash(password,10 )
                existinguserbyemail.password=hashedPassword
                existinguserbyemail.verifyCode=verifyCode
                existinguserbyemail.verifyCodeExpiry=new Date(Date.now()+3600000)
                await existinguserbyemail.save()
            }
        }
        else{
            const hashedPassword= await bcrypt.hash(password,10)
            const expiryDate= new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser= new UserModel({
                    username,
                    email,
                    password:hashedPassword,
                    verifyCode,
                    verifyCodeExpiry:expiryDate,
                    isVerified:false,
                    isAcceptingMsg:true,
                    messages:[]
            })
            await newUser.save()
        }

        const emailresponse= await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailresponse.success){
            return Response.json({
                success:false,
                message:emailresponse.message
            },{status:500})
        }

        return Response.json({
            success:true,
            message:"User registered successsfully. Please verify you email"
        },{status:201})

    } catch (error) {
        console.error("Error registering User",error)
        return Response.json({
            success:false,
            message:"Error registering User"
        },{
            status:500
        })
    }
}