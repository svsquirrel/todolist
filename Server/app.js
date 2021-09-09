const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded( { extended: false}));
app.use(bodyParser.json());

const dbCon = require('./dbCon');

//read
app.get('/getAll', (request, response) => {
    const db = dbCon.getDbInstance();
    const result = db.getData();

    result 
    .then(data => response.json({ data : data}))
    .catch(err => console.log(err));    
});
//create
app.post('/insert', (request, response) => {
    const { task }= request.body;
    const db = dbCon.getDbInstance();
    const result = db.insertNewTask(task);

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));

});
// update
app.patch('/update', (request, response) => {
    const { id, task } = request.body;
    const db = dbCon.getDbInstance();

    const result = db.updateTaskById(id, task);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});


app.listen(process.env.PORT, () => console.log('app is running'));