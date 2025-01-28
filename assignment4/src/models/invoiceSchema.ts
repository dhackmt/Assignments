import sequelize from "../database/pgConfig";
import { DataTypes,Model } from "sequelize";


class invoice extends Model{
    public invoiceId!:number;
    public amount!:number;
    public customerId!:string
    public receivedOn!:Date;
    public readonly createdAt!:Date;
    public readonly UpdatedAt!:Date;
}

invoice.init({
  invoiceId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
   amount:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    customerId:{
            type:DataTypes.INTEGER,
            allowNull:false,
    },
    organisationId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    receivedOn:{
        type:DataTypes.DATE,
        allowNull:false,   
    }
},{
    sequelize,
    tableName:"invoice",
    timestamps:true,
});

export default invoice;