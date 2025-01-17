import { InsertWeather } from "../services/service";
import axios from 'axios';
import {Items } from '../types/type';
import { Request,Response } from "express";
import { Weather } from "../models/weatherSchema";
import { sendMail } from "../email/email";



interface GeoData{
    city:string;
    country:string;
    longitude:string;
    latitude:string;
}


const BASE_URL="https://api.api-ninjas.com/v1/geocoding";
const API_KEY="VkhEkEcrvcpKIQLITnvMxA==8SSCE29EeiHlLEgI";
const WEATHER_URL="https://weatherapi-com.p.rapidapi.com/current.json"
const RAPID_API="e0b9e3fcb2msh168bb1734b4d223p10176fjsna3aa10f5df1d";

async function getRequestedData(endpoint:string):Promise<GeoData[] | undefined>{
    try{
        const response=await axios.get<GeoData[]>(`${BASE_URL}${endpoint}`,{
            headers:{
               "X-Api-Key":API_KEY,
            }
        });
        return response.data;
    }catch(err)
    {
        console.log(err);
    }
}


async function getWeather(query:string):Promise<any>{
    try{    
        const response=await axios.get(`${WEATHER_URL}?q=${query}`,{
            headers:{ 
                "x-rapidapi-key":RAPID_API,
            }
        });
        return response;
    }
    catch(err)
    {
        console.log(err);
    }
}


export async function SaveWeatherMapping(req:Request,res:Response) {
        const items=req.body;
        if (!items || !Array.isArray(items)) {
             res.status(400).json({ error: "Invalid request body. Expected an array of items." });
        }
        const results=await Promise.all(
            items.map(async (item:Items)=>{
            try{
                const response=await getRequestedData(`/?city=${item.city}&country=${item.country}`);
                
                if(!response || response.length==0)
                {
                    return { city: item.city, country: item.country, error: "Geocoding data not found" };
                }
                const {latitude,longitude}=response[0];
                const query=latitude+longitude;
                const weatherData=await getWeather(query);
                if(!weatherData)
                {
                    return { city: item.city, country: item.country, error: "weather data not found" };
                }
                const weather=weatherData.data.current.condition.text;
                if(!latitude || !longitude || !weather)
                {
                    res.json({error:"No data found"});
                    return;
                }
                const InsertedData=await InsertWeather(item.city,item.country,weather,latitude,longitude); 
                console.log(InsertedData)
            }
            catch(err)
            {
                console.log(err);
            }
            })
        );
    
         res.json({message:"Data inserted successfully"});
    }

    export const weatherDashboard=async(req:Request,res:Response)=>{
        const city=req.params   .city;
        if(city)
        {
            const condition={where:{city:`${city}`}}
            const data=await Weather.findAll(condition);
            res.json({data});
        }
        else{
            const data=await Weather.findAll();
            res.json({data});
        }   
    }

export const sendDataAsMail=async(req:Request,res:Response)=>{
    const city=req.body.city;
    try
    {
        if(city)
            {
                const condition={where:{city:`${city}`}};
                const data=await Weather.findAll(condition);
                const content=`<html><table border=1>
                <tr>
                <th>city</th>
                <th>country</th>
                <th>weather</th>
                </tr>
                ${data.map(rec=>`
                    <tr>
                    <td>${rec.city}</td>
                    <td>${rec.country}</td>
                    <td>${rec.weather}</td>
                    <td>${rec.latitude}</td>
                    <td>${rec.longitude}</td>
                    </tr>
                    `
                ).join(" ")}
                </table>
                </html>`
                const result=await sendMail(content);
                res.json({message:"Mail sent"})
            }

    }
   catch(err)
   {
    console.log(err)
   }
}