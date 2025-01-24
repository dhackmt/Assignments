import sequelize from "../database/pgConfig";
import { DataTypes,Model } from "sequelize";

class PaymentPlan extends Model{
    public planId!:number;
    public particulars!:string;
    public amount!:number;
    public dueDate!:Date;
    public status!:string;

    public readonly createdAt!:Date;
    public readonly UpdatedAt!:Date;
}

PaymentPlan.init({
    planId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    particulars:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    amount:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    dueDate:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    status:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue:"pending",
    }
},{
    sequelize,
    tableName:"PaymentPlan",
    timestamps:true,
});

export default PaymentPlan;