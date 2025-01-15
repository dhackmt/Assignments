import {Pool} from 'pg';

const pool=new Pool({
    user:"postgres",
    database:"TestOrder",
    password:"root",
    port:5432,
    host:"localhost",
});

export default pool;