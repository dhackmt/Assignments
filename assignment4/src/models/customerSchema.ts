import { DataTypes,Model } from "sequelize";
import sequelize from '../database/pgConfig';



interface CustomerAttributes{
    Cust_id:number;
    Cust_name:string;
    Cust_email:string;
    Cust_password:string;
    Cust_phone:string;
    Cust_address:string;
   
}

class Customer extends Model implements CustomerAttributes{
    public Cust_id!:number;
    public Cust_name!:string;
    public Cust_email!:string;
    public Cust_password!:string;
    public Cust_phone!:string;
    public Cust_address!:string;
    public readonly createdAt!:Date;
    public readonly UpdatedAt!:Date; 
}

Customer.init({
    Cust_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true, 
    },
    Cust_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    Cust_email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    Cust_password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    Cust_phone:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    Cust_address:{
        type:DataTypes.STRING,
        allowNull:false,
    },
},{
    sequelize: sequelize,
    tableName:"customers",
    timestamps:true,
    modelName: 'Customer'
});




export default Customer;