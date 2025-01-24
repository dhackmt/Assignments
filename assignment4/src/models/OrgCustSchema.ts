import sequelize from "../database/pgConfig";
import { DataTypes,Model } from "sequelize";


class OrgCust extends Model{
    public id!:number;
    public readonly createdAt!:Date;
    public readonly UpdatedAt!:Date;
};

OrgCust.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    }
},{
    sequelize,
    tableName:"OrgCust",
    timestamps:true,
});


export default OrgCust;