import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { responseMessageGenerator } from "@/helpers/responseMessageGenerator";

export async function POST(request: Request){
    await dbConnect()

    try{
       const {username, email, password} = await request.json()

       const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified: true})
    
       if(existingUserVerifiedByUsername) {

        const res = {
            success: false,
            message: "Username is not available",
            status:400
        }

        return responseMessageGenerator(res)

       }

       const existingUserByEmail = await UserModel.findOne({email})
       const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

       if(existingUserByEmail){

        if(existingUserByEmail.isVerified){
            const res = {
                success: false,
                message: "Email is already registered",
                status:400
            }
    
            return responseMessageGenerator(res)

        } else {
            const hashedPassword = await bcrypt.hash(password,10)
            existingUserByEmail.password = hashedPassword
            existingUserByEmail.verifyCode = verifyCode
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000 )
            await existingUserByEmail.save()
        }

       }else {
        const hashedPassword = await bcrypt.hash(password,10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours()+1)

        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: true,
            isAcceptingMessages: true,
            messages: []
        })

        await newUser.save()
       }

       const emailResponse  = await sendVerificationEmail(email,username,verifyCode)

       if(!emailResponse){
        const res = {
            success: false,
            message: "Failed sending email",
            status:500
        }

        return responseMessageGenerator(res)
       }

        const res = {
            success: true,
            message: "User registered successfully",
            status:201
        }

        return responseMessageGenerator(res)

    } catch(err){
        console.log("Error registering user")
        const res = {
            success: false,
            message: "Error Regestering user",
            status: 500
        }

        return responseMessageGenerator(res)

    }
}