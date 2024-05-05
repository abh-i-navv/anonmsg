import {getServerSession, User} from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import { dbConnect } from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { responseMessageGenerator } from "@/helpers/responseMessageGenerator"
import mongoose from "mongoose"

export async function GET(request: Request){
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

    const userId = new mongoose.Types.ObjectId(user._id)

    try{
        const user = await UserModel.aggregate([
            { $match : {id:userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        if(!user || user.length === 0 ){
            const res = {
                success: false,
                message: "User not found",
                status: 404
            }
            return responseMessageGenerator(res)
        }

        const res = {
            success: true,
            message: user[0].messages,
            status: 200
        }
        return responseMessageGenerator(res)

    } catch(err){
        console.log("an unexpected error occured: ",err)
        const res = {
            success: false,
            message: "error",
            status: 500
        }
        return responseMessageGenerator(res)
    }

}