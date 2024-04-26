import { responseMessageGenerator } from "@/helpers/responseMessageGenerator";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect()

    try{
        const {username, code} = await request.json()

        const urlDecodedUser = decodeURIComponent(username)
        const user  = await UserModel.findOne({username: urlDecodedUser})

        if(!user){
            const res = {
                success:false,
                message: "User not found",
                status: 500
            }
            return responseMessageGenerator(res)
        }

        const isCodeValid = user.verifyCode === code
        const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date()

        if(isCodeValid && !isCodeExpired){
            user.isVerified = true
            user.save()

            const res = {
                success:true,
                message: "User verified successfully",
                status: 200
            }
            return responseMessageGenerator(res)
        } 
        else if(isCodeExpired){
            const res = {
                success:false,
                message: "verification code is expired, please sign up again",
                status: 400
            }
            return responseMessageGenerator(res)
        }
        else{
            const res = {
                success:false,
                message: "verification code is incorrect",
                status: 400
            }
            return responseMessageGenerator(res)
        }

    } catch(err){
        console.log("Error verifying user", err)
        
        const res = {
            success:false,
            message: "Error verifying user",
            status: 500
        }

        return responseMessageGenerator(res)

    }

}