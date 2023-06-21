
export default async function getLocation(hint:string){
    
    try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${hint}&key=${process.env.NEXT_PUBLIC_PLACES_API_KEY}`);
        const result = await response.json();
        return result.results
    } catch (error) {
        return error
    }
}