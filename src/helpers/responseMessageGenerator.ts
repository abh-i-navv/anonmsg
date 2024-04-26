
interface responseMessage{
    success: boolean;
    message: string;
    status: number;
}

export function responseMessageGenerator({success, message, status} :responseMessage) {
    return Response.json({
        success:success,
        message: message
    },{
        status:status
    })
}