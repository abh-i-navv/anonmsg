"use client"
import {useSession, signIn, signOut} from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import {useDebounceCallback} from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"

function page() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { toast } = useToast()
    const router = useRouter()

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.username,
            password: data.password
        })

        if(result?.error){
            toast({
                title: "Login failed",
                description: "Incorrect username or password",
                variant: "destructive"
            })
        }

        if(result?.url){
            router.push(`/dashboard`)
        }

    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Join True Feedback
            </h1>
            <p className="mb-4">Sign in to start your anonymous adventure</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="email" {...field}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="password" {...field}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {
                        isSubmitting ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                        Please wait
                        </>
                        ) : ('Sign in')
                    }
                </Button>
                </form>
            </Form>
            <div className="text-center mt-4">
            <p>
                Need an account?{' '}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                Sign up
                </Link>
            </p>
            </div>

            </div> 
        </div>
    )
}

export default page