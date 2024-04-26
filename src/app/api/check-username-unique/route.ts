import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";
import { responseMessageGenerator } from "@/helpers/responseMessageGenerator";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:NextRequest){
    await dbConnect()

    try{
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        const result = UsernameQuerySchema.safeParse(queryParam)
        
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            
            const res = {
                success: false,
                message: "Invalid username",
                status:400
            }
    
            return responseMessageGenerator(res)

        }

        const {username} = result.data
        
        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})

        if(existingVerifiedUser){
            const res = {
                success: false,
                message: "Username is already taken",
                status: 400
            }

            return responseMessageGenerator(res)
        }

        const res = {
            success: true,
            message: "Username is unique",
            status: 200
        }

        return responseMessageGenerator(res)


    } catch(err){
        console.log("Error checking username", err)

        const res = {
            success: false,
            message: "Error checking username",
            status:500
        }

        return responseMessageGenerator(res)

    }

}