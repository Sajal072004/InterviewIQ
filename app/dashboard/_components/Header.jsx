"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

function Header() {

  const path = usePathname();
  const router = useRouter();

  const dashboardPage = () => {
    router.push('/dashboard');
  }

  const Home = () => {
    router.push('/');
  }


  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md'>
      <Image className='cursor-pointer' onClick={()=>dashboardPage()} src={'/logo.png'} width={130} height={80} alt='logo'/>
      <ul className='hidden sm:flex sm:gap-6 md:flex gap-6'>
        <li onClick={()=>dashboardPage()} className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == '/dashboard' && 'text-primary font-bold transition-all' }`}>Dashboard</li>
        <li onClick={()=>Home()} className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == '/dashboard/questions' && 'text-primary font-bold transition-all' }`}>Home</li>
        {/* <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == '/dashboard/upgrade' && 'text-primary font-bold transition-all' }`}>Upgrade</li> */}
        <a href="https://sajalnamdeo.vercel.app" target='_blank'>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path == '/dashboard/how' && 'text-primary font-bold transition-all' }`}>About Me</li>
        </a>
        
      </ul>
      <UserButton/>
    </div>
  )
}

export default Header