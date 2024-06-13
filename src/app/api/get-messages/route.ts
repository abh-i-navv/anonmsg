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

    const name = user.username
    
    try{

        const existingUser = await UserModel.findOne({username: name})

        const user = await UserModel.aggregate([
            { $match : {username: name}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
            ])
            

        if(existingUser && (!user || user.length === 0) ){
            const res = {
                success: false,
                message: "no messages",
                status: 200
            }
            return responseMessageGenerator(res)
        }
        
        return Response.json({
            success:true,
            messages: user[0].messages
        },{
            status:200
        })

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