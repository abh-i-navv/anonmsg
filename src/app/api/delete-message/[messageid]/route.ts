"use server"

import { dbConnect } from "@/lib/dbConnect"
import { User, getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"
import UserModel from "@/model/User"

export async function DELETE(request: Request, {params}: {params: {messageid: string}}){
    
    const messageId = params.messageid
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !user){
        return Response.json({
            success: false,
            message: "User not authenticated"
        },{
            status: 401
        })
    }
    try {
        const updatedUser = await UserModel.updateOne({_id: user._id
        },{
            $pull: {messages: {_id: messageId}}
        })

        console.log(updatedUser)

        if(updatedUser.modifiedCount === 0){
            return Response.json(
                {
                    success: false,
                    message: "no message deleted"
                },{
                    status: 401
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "message deleted"
            },{
                status: 200
            }
        )

    } catch (error) {
        return Response.json({
            success: false,
            message: "error deleting message"
        },{
            status: 500
        })
    }

}