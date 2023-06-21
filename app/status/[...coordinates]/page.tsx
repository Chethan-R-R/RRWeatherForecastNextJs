"use client"
import { Global_context } from "@/app/context/global_context"
import {getDaily, getWeather} from "@/app/fetchers/weather"

import { useContext, useEffect } from "react"

export default function Page({params}:{params:{coordinates:String[]}}){
    const Global=useContext(Global_context)
    
    useEffect(()=>{
        async function getWeatherData(){
            Global?.displayLoading(true)
            try{
            const resCurrent=await getWeather(params.coordinates[0],params.coordinates[1])
            const resDaily=await getDaily(params.coordinates[0],params.coordinates[1])
            Global?.updateWeather(resCurrent,resDaily.list)
            
            }catch(err){
                console.log(err)
            }
            Global?.displayLoading(false)
        }
        getWeatherData()
    },[])
    return(
        <></>
    )
}