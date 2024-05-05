import { responseMessageGenerator } from "@/helpers/responseMessageGenerator";
import { dbConnect } from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(request:Request){
    await dbConnect()

    const {username, content} = await request.json()

    try{

        const user = await UserModel.findOne({username})

        if(!user){
            const res = {
                success: false,
                message: "User not found",
                status: 404
            }
            return responseMessageGenerator(res)
        }

        //if user accepting messages

        if(!user.isAcceptingMessages){
            const res = {
                success: false,
                message: "User not accepting messages",
                status: 403
            }
            return responseMessageGenerator(res)
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        const res = {
            success: true,
            message: "message sent successfully",
            status: 200
        }
        return responseMessageGenerator(res)

    } catch(err){
        console.log("error sending messages: ",err)
        const res = {
            success: false,
            message: "internal server error",
            status: 500
        }
        return responseMessageGenerator(res)
    }

}