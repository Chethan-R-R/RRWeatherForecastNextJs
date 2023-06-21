'use client'
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { setTimeout } from "timers"
export default function Home() {
  const [trigger,setTrigger]=useState(false)
  useEffect(()=>{
    if(trigger){
      redirect('/status')
    }
  },[trigger])
  setTimeout(()=>setTrigger(true),3500)
  return(
    <main className="main" >
      <div className="themebg">
      <div className="moon"><img className="rainstorm" src="/rain.svg" alt='' /></div>
      </div>
        <header className="welcometitle">
          <h1>R R</h1>
        <h1>Weather Forecast </h1>
        </header>
    </main>
  )
}
