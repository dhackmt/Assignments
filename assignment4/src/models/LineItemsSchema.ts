import sequelize from "../database/pgConfig";
import { DataTypes,Model } from "sequelize";


class LineItems extends Model{
    public lineId!:number;
    public particulars!:string;
    public amount!:number;
    public readonly createdAt!:Date;
    public readonly UpdatedAt!:Date;
}

LineItems.init({
   lineId:{
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

export default LineItems;