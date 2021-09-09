const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
let instance = null;

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err)=> {
    if (err){
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});

class DbCon {
     static getDbInstance() {
         return instance ? instance : new DbCon();
 }
 //READ
 async getData(){
    try{
        const response = await new Promise ((resolve, reject) => {
            
            const query = 'SELECT * FROM tasklist;';
            connection.query(query,(err, results) => {
                if(err) reject( new Error(err.message));
                resolve(results);
            })
        });
                return response;
    
    } catch(error){
            console.log(error);
        }
    }
//CREATE
async insertNewTask(task, important) {
    try{
        const dateAdded = new Date();
        const insertID = await new Promise ((resolve, reject) => {
        const query = 'INSERT INTO tasklist (date_added, task, important) VALUES (?,?,?);';

            connection.query(query,[ dateAdded, task, important] ,(err, result)=> {
                if(err) reject( new Error(err.message));
                resolve(result.insertID);
            })
        });console.log(dateAdded);
            return{
                id: insertID,
                dateAdded: dateAdded,
                task: task,
                important: important
            };

        }catch (error){
        console.log(error);
    }
}
//UPDATE
async updateTaskById(id, task) {
    try {
        id = parseInt(id, 10); 
        const response = await new Promise((resolve, reject) => {
            const query = "UPDATE tasklist SET task = ? WHERE id = ?";

            connection.query(query, [task, id] , (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result.affectedRows);
            })
        });

        return response === 1 ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    }
}
//DELETE
async deleteRowById(id){
    try{
        id = parseInt(id, 10);
        const response = await new Promise((resolve, reject) => {
            const query = "DELETE FROM tasklist WHERE id = ?";

            connection.query(query, [id] , (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result.affectedRows);
            })
        });

        return response === 1 ? true : false;
    } catch (error) {
        console.log(error);
        return false;
    }
}
}




module.exports = DbCon;