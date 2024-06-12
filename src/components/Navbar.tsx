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
    <nav>
        <div>
            <a href='#'>Mystery Message</a>
            { session?
                (<>
                <span>Welcome, {user.username || user.email}</span>
                <Button onClick={() => {signOut()}}>Logout</Button>
                </>
                ) : (
                    <Link href={'/sign-in'}>
                        <Button>Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}