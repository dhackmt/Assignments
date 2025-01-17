import express from 'express';
import sequelize from './database/pgConfig';
import WeatherRoute from './routes/route';


const app=express();


app.use(express.json());


app.use("/api",WeatherRoute)

app.listen(3000,()=>{
    console.log("server is running");
})

const startServer=async()=>{
    try{
        await sequelize.authenticate()
        console.log("connection authenticated");
        await sequelize.sync({alter:true});
        console.log("database synchronized")

      
    }catch(error)
    {
        console.log("error connecting to db")
    }
};

startServer();