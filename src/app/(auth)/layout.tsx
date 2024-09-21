import Navbar from "@/components/Navbar"

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-800">
      <a href='/' className='flex justify-center items-center w-full text-xl p-5 font-bold text-white'>Anonymous Message &nbsp;</a>
      
        {children}
      </body>
    </html>
  )
}
