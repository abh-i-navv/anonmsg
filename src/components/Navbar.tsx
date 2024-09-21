"use client"

import React from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'

export default function Navbar() {

    const {data: session} = useSession()
    const user: User = session?.user

  return (
    <nav className='p-4 md:p-6 shadow-md bg-gray-900 text-white'>
        <div className='container mx-auto flex flex-row justify-between items-center'>
            <a href='/' className='text-xl font-bold mb-4 md:mb-0'>Anonymous Message &nbsp;</a>
            { session?
                (<>
                <Button variant={"secondary"} onClick={() => {signOut()}}>Logout</Button>
                </>
                ) : (
                    <Link href={'/sign-in'}>
                        <Button variant={"secondary"}>Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}
