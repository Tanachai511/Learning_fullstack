const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const moment = require('moment');
const cors = require('cors');
const { status } = require('express/lib/response');
const app = express();
const port = 8000;

const dbConfig = {
    "host":"127.0.0.1",
    "user":"root",
    "password":"",
    "database":"se_65022511"
}

app.use(cors());
app.use(bodyParser.json());

app.get('/users' , async (req, res) => {
    const conn = await mysql.createConnection(dbConfig);
    const [data] = await conn.query("SELECT * FROM users");
    conn.end();
    res.json(data);
});

app.post('/users' , async(req, res) => {
    try {
        const conn =  await mysql.createConnection(dbConfig);
        const [data] = await conn.query(
            "INSERT INTO users (code, first_name, last_name, tel, address, gender, email, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
             [
              moment().format('DDMMYYYYhhmmss'), // รหัสสมาชิก (timestamp)
              req.body.first_name,
              req.body.last_name,
              req.body.tel,
              req.body.address,
              req.body.gender,
              req.body.email,
              1
            ])
        conn.end(); 
        res.json({
            "message": "บันทึกข้อมูลสำเร็จแล้ว",
            "id": data.insertId,
            "data": req.body
        });
    } catch (error) {
        res.status(500).json({"message: " :error.message});
    }
});

app.put('/users/:id' , async(req, res) => { 
    try {
      const conn = await mysql.createConnection(dbConfig);  
        const [data] = await conn.query("UPDATE users SET first_name = ?, last_name = ?, tel = ? ,address = ? , gender = ? , email = ? WHERE id = ?",
        [
            req.body.first_name,
            req.body.last_name,
            req.body.tel,
            req.body.address,
            req.body.gender,
            req.body.email,
            req.params.id
        ]);
        conn.end();
        res.json({
            "message": "แก้ไขข้อมูลสำเร็จแล้ว",
            "id": req.params.id,
            "data": req.body
        });
    } catch (error) {
        res.status(500).json({"message: " :error.message});
    }

});

app.get('/users/:id' , async (req, res) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [data] = await conn.query("SELECT * FROM users WHERE id = ?",[req.params.id]);
        conn.end();
        let user = data .length == 0 ? {} : data[0];
        res.json(user);
    } catch (error) {
        res.status(500).json({"message :" : error.message});
    }
});


app.delete('/users/:id' , async(req, res) => {
    try {
        let id = req.params.id;
const conn =  await mysql.createConnection(dbConfig);
        await conn.query("DELETE FROM users WHERE id = ?", [id]);
        conn.end();
        res.json({
            "message": "ลบข้อมูลสำเร็จแล้ว",
            "id": id
        });
    } catch (error) {
        res.status(500).json({"message: " :error.message});
    } 
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});