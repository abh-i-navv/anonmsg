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
    <nav className='flex justify-center items-center w-full'>
        <div className='flex  w-full'>
            <a href='/' className='flex justify-center items-center w-full text-lg font-bold'>Mystery Message &nbsp;</a>
            { session?
                (<>
                <Button onClick={() => {signOut()}}>Logout</Button>
                </>
                ) : (
                    <Link href={'/sign-in'}>
                        <Button >Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}
