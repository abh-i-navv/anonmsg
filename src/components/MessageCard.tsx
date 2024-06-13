"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import dayjs from "dayjs"
import { Button } from "./ui/button"
import { Trash, X } from "lucide-react"
import { Message } from "@/model/User"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useRouter } from "next/navigation"

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId:string) => void
}

export default function MessageCard({message, onMessageDelete} :MessageCardProps) {

    const router = useRouter()
    const {toast} = useToast()
  
    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        
        toast({
            title: response.data.message
        })
        onMessageDelete(message._id)

        location.reload(true)
    
    }
  
    return (
    <Card>
    <CardHeader>
        <CardTitle>{message.content}</CardTitle>
        <AlertDialog>

      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-[55px]"><Trash className="w-5 h-5"/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

        <CardDescription>{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</CardDescription>
    </CardHeader>
    </Card>
  )
}
