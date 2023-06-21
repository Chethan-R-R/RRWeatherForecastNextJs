

export  async function getWeather(lat:String,lon:String) {
    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`)
        return res.json()
    }catch(err){
        return err
    }
    
}

export  async function getDaily(lat:String,lon:String) {
    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`)
        return res.json()
    }catch(err){
        return err
    }
    
}