import {getServerSession, User} from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import { dbConnect } from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { responseMessageGenerator } from "@/helpers/responseMessageGenerator"

export async function POST(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session || !user){
        const res = {
            success: false,
            message: "Not Authenticated",
            status: 401
        }
        return responseMessageGenerator(res)
    }

    const userId = user._id
    const {acceptMessages} = await request.json()

    try{
        const updatedUser = UserModel.findByIdAndUpdate(userId, {isAcceptingMessages: acceptMessages}, {new: true})

        if(!updatedUser){
            const res = {
                success: false,
                message: "User not found",
                status: 401
            }
            return responseMessageGenerator(res)
        }

        const res = {
            success: true,
            message: "user updated successfully",
            status: 200
        }
        return responseMessageGenerator(res)

    } catch(err){
        console.log("failed to update accept messages status")
        const res = {
            success: false,
            message: "failed to update accept messages status",
            status: 500
        }
        return responseMessageGenerator(res)
    }

}

export async function GET(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session || !user){
        const res = {
            success: false,
            message: "Not Authenticated",
            status: 401
        }
        return responseMessageGenerator(res)
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)
    
        if(!foundUser){
            const res = {
                success: false,
                message: "user not found",
                status: 404
            }
            return responseMessageGenerator(res)
        }
    
        const res = {
            success: true,
            message: foundUser.isAcceptingMessages,
            status: 200
        }
        return responseMessageGenerator(res)
    } catch (error) {
        console.log("error in getting message accept status")
        const res = {
            success: false,
            message: "error in getting message accept status",
            status: 500
        }
        return responseMessageGenerator(res)
  
    }

}