import { DataTypes,Model } from "sequelize";
import sequelize from '../database/pgConfig';
import bcrypt from 'bcrypt';


interface OrganisationAttributes{
    id:number;
    Orgname:string;
    GSTNo:string;
    PAN_No:string;
    email:string;
    password:string;
    phone:string;
    address:string;
};

class Organisation extends Model implements OrganisationAttributes{
    public id!:number;
    public Orgname!:string;
    public GSTNo!:string;
    public PAN_No!:string;
    public email!:string;
    public password!:string;
    public phone!:string;
    public address!:string;
    public readonly createdAt!:Date;
    public readonly UpdatedAt!:Date;

    public static async hashPassword(password:string):Promise<string>{
        const saltRounds=10;
        const salt=await bcrypt.genSalt(saltRounds);
        return bcrypt.hash(password,salt);
    }

    //check if password entered by user matches with the one in database
    public static async comparePassword(enteredPassword:string,storedPassword:string):Promise<boolean>{
        return bcrypt.compare(enteredPassword,storedPassword);
    }

}

Organisation.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    Orgname:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    GSTNo:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    PAN_No:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    address:{
        type:DataTypes.STRING,
        allowNull:false,
    },

},{
    sequelize: sequelize,
    tableName:"organisations",
    timestamps:true,
});




export default Organisation;