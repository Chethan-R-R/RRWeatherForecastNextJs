'use client'
import { type } from "os";
import React, { createContext, useEffect, useState } from "react";

type currentWeather={
    name:string,
    main:{
        temp:number,
        feels_like:number,
        humidity:number
    },
    wind:{
        speed:number,
    },
    weather:[{main:string}],
    dt:number,
    sys:{
        sunrise:number,
        sunset:number
    },
    clouds:{
        all:number
    },
    dt_txt:string,
    timezone:number
}
type weatherreport={
    theme:JSX.Element,
    searchTheme:Boolean,
    currentWeather:currentWeather,
    updateWeather:Function,
    meanDailyWeather:meanDailyWeather[] | undefined,
    Loading:boolean,
    displayLoading:Function
}
type meanDailyWeather={
    date:string,
    temp:number,
    humidity:number,
    wind:number,
    rain:number,
    cloudy:number,
    clear:number,
    thundersrorm:number,
    clouds:number
}

export const Global_context=createContext<weatherreport | undefined>(undefined)

export const Global_context_provider=({children}:{children:React.ReactNode})=>{
    
    const [Loading,setLoading]=useState(false)

    const Sunny=<div className="sunny"></div>
    const moon=<div className="moon"></div>
    const Sunny_partly_cloudy=<div className="sunny"><img className="partlycloudy" src="/partly_cloudy.svg" alt='' /></div>
    const moon_partly_cloudy=<div className="moon"><img className="partlycloudy" src="/partly_cloudy.svg" alt='' /></div>
    const Night_Rain=<div className="moon"><img className="rain" src="/partly_cloudy.svg" alt='' /><img className="rain" src="/rain.svg" alt='' /></div>

    const Night_Rain_storm=<div className="moon"><img className="rainstorm" src="/partly_cloudy.svg" alt='' /><img className="rainstorm" src="/rain.svg" alt='' /></div>
    const sunny_rain_storm=<div className="sunny"><img className="cloudy" src="/partly_cloudy.svg" alt='' /><img className="rainstorm" src="/rain.svg" alt='' /></div>
    const sunny_rain=<div className="sunny"><img className="rain" src="/partly_cloudy.svg" alt='' /><img className="rain" src="/rain.svg" alt='' /></div>

    const [theme,setTheme]=useState(Night_Rain_storm)
    
    //true==whiteTheme false==blackTheme
    const [searchTheme,setSearchTheme]=useState(false)

    const [currentWeather,setCurrentWeather]=useState<currentWeather>({
        name:"",
        main:{
            temp:273.19,
            feels_like:273.19,
            humidity:0
        },
        wind:{
            speed:0,
        },
        weather:[
            {
                main:"Thunderstorm"
            }
        ],
        dt:1687199444,
        sys:{sunrise:1687216252,
            sunset:1687261535},
        clouds:{all:40},
        dt_txt:"",
        timezone:0
    })

    const [dailyWeather,setDailyWeather]=useState<currentWeather[]>([
        {   name:"",
            main:{
                temp:0,
                feels_like:0,
                humidity:0
            },
            wind:{
                speed:0,
            },
            weather:[
                {
                    main:""
                }
            ],
            dt:1687199444,
            sys:{sunrise: 1687216252,
                sunset:1687261535
            
            },
            clouds:{all:40},
            dt_txt:"",
            timezone:0
        }
    ])

    const [meanDailyWeather,setMeanDailyWeather]=useState<meanDailyWeather[] | undefined>([])

    useEffect(()=>{
        if (Math.floor(Date.now() / 1000) >= currentWeather.sys.sunrise && Math.floor(Date.now() / 1000) <= currentWeather.sys.sunset) {
            if(currentWeather.weather[0].main==="Rain"){
                setTheme(sunny_rain)
            }else if(currentWeather.weather[0].main==="Thunderstorm"){
                setTheme(sunny_rain_storm)
            }else if(currentWeather.weather[0].main==="Clouds"){
                setTheme(Sunny_partly_cloudy)
            }else setTheme(Sunny)
            setSearchTheme(true)
          } else {
            if(currentWeather.weather[0].main==="Rain"){
                setTheme(Night_Rain)
            }else if(currentWeather.weather[0].main==="Thunderstorm"){
                setTheme(Night_Rain_storm)
            }else if(currentWeather.weather[0].main==="Clouds"){
                setTheme(moon_partly_cloudy)
            }else setTheme(moon)
            setSearchTheme(false)
          }
    },[currentWeather])

    useEffect(()=>{
    let temp_mean_daily=[]
    var date=dailyWeather[0].dt_txt.slice(0,10)
    var temp=dailyWeather[0].main.temp
    var humidity=dailyWeather[0].main.humidity
    var wind=dailyWeather[0].wind.speed
    var rain=0
    var cloudy=0
    var clear=0
    var thundersrorm=0
    var clouds=dailyWeather[0].clouds.all
    var countForDivide=1
    for(let i=1;i<dailyWeather.length;i++){
        if(date!==dailyWeather[i].dt_txt.slice(0,10) || i===dailyWeather.length-1){
            temp_mean_daily.push({
                date:date,temp:temp/countForDivide,humidity:humidity/countForDivide,wind:wind/countForDivide,rain:rain,cloudy:cloudy,clear:clear,thundersrorm:thundersrorm,clouds:clouds/countForDivide
            })
            date=dailyWeather[i].dt_txt.slice(0,10)
            temp=dailyWeather[i].main.temp
            humidity=dailyWeather[i].main.humidity
            wind=dailyWeather[i].wind.speed
            rain=0
            cloudy=0
            clear=0
            thundersrorm=0
            switch(dailyWeather[i].weather[0].main){
                case "Rain":rain=1
                break
                case "Clouds":cloudy=1
                break
                case "Clear":clear=1
                break
                case "Thunderstorm":thundersrorm=1
            }
            clouds=dailyWeather[i].clouds.all
            countForDivide=1
        }else{
            temp+=dailyWeather[i].main.temp
            humidity+=dailyWeather[i].main.temp
            wind+=dailyWeather[i].wind.speed
            switch(dailyWeather[i].weather[0].main){
                case "Rain":rain++
                break
                case "Clouds":cloudy++
                break
                case "Clear":clear++
                break
                case "Thunderstorm":thundersrorm++
                break
            }
            clouds+=dailyWeather[i].clouds.all
            countForDivide++
        }
    

    }
    setMeanDailyWeather(temp_mean_daily)

    },[dailyWeather])
    function updateWeather(data:currentWeather,daily:currentWeather[]){
        setCurrentWeather(data)
        setDailyWeather(daily)
        
    }

    function displayLoading(sorno:boolean){
        setLoading(sorno)
    }
    return(
        <Global_context.Provider value={{theme,searchTheme,currentWeather,updateWeather,meanDailyWeather,Loading,displayLoading}}>
            {children}
        </Global_context.Provider>
    )
}