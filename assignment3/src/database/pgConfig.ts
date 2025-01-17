import { Sequelize } from "sequelize";

const sequelize=new Sequelize({
    username:"postgres",
    password:"root",
    port:5432,
    dialect:'postgres',
    host:'localhost',
    database:"weatherDatabase"
});


export default  sequelize;