import { Weather } from "../models/weatherSchema";

export const InsertWeather=async(city:string,country:string,weather:string,latitude:string,longitude:string):Promise<any>=>{
    try{
    const data=await Weather.create({city,country,weather,latitude,longitude});
    return data;
    }
    catch(err)
    {
        console.log(err);
    }
}