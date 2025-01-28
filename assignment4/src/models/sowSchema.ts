import sequelize from "../database/pgConfig";
import { DataTypes,Model } from "sequelize";
import PaymentPlan from "./paymentPlanSchema";

class Sow extends Model{
    public sowId!:number;
    public totalAmt!:number;
    public installments!:number;
    public months!:number;
    public sow_SignedOn!:Date;
    public projectName!:string;
    public readonly createdAt!:Date;
    public readonly UpdatedAt!:Date;
}

Sow.init({
    sowId:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
    },
    totalAmt:{
            type:DataTypes.INTEGER,
            allowNull:false,
    },
    installments:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    months:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    sow_SignedOn:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    projectName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
},{
    sequelize,
    tableName:"sow",
    timestamps:true,
});


export default Sow;