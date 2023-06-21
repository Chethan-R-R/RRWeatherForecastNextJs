import { PLACES_API_KEY } from "@/env";

export default async function getLocation(hint:string){
    
    try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${hint}&key=${PLACES_API_KEY}`);
        const result = await response.json();
        return result.results
    } catch (error) {
        return error
    }
}