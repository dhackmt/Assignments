import sequelize from "../database/pgConfig";
import { DataTypes,Model } from "sequelize";


class Weather extends Model{
    public id!:number;
    public city!:string;
    public country!:string;
    public weather!:string;
    public longitude!:string;
    public latitude!:string;
}

Weather.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
      city:{
            type:DataTypes.STRING,
            allowNull:false,
      } ,
      weather:{
        type:DataTypes.STRING,
        allowNull:false
    } ,
      longitude:{
        type:DataTypes.STRING,
        allowNull:false,
      },latitude:{
        type:DataTypes.STRING,
        allowNull:false
      }
    },
    {
        sequelize,
        tableName:"weather",
        timestamps:true,
    }
    );

export {Weather};