"use client"

import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"

export default function page() {
  return (
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>
        Explore the realm of anonymous conversations
        </h1>
      </section>
      <Carousel 
        plugins={[Autoplay({delay: 3000})]}
        className="w-full max-w-xs">
      <CarouselContent>
        {
          messages.map((msg,index) => {
            return (<CarouselItem key={index}>
            <div className="p-1">
              <Card className='flex flex-col items-start bg-slate-900 text-white'>
                <CardHeader >
                  <h2>
                    {msg.title}
                  </h2>
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-lg font-semibold">{msg.content}</span>
                </CardContent>
                <CardFooter>
                  {msg.received}
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>)
          })
        }

      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    </main>
  )
}
