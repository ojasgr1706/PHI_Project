var express = require('express');
var Client = require('pg').Client;
var cors = require('cors');
var app = express();
app.use(express.urlencoded({ extended: true }), express.json(), cors());
var client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'passwd',
    database: 'phi_db'
});
client.connect().then();
app.get('/patientData', function (req, res) {
    client.query('SELECT * FROM patients', function (req, result) {
        console.log(result.rows);
        var ret = {};
        for (var i = 0; i < result.rows.length; i++) {
            ret[i] = {
                name: result.rows[i].name,
                dob: result.rows[i].dob,
                phone_num: result.rows[i].phone_number,
                addr: result.rows[i].address,
                weight: result.rows[i].weight,
                height: result.rows[i].height,
                chicken_pox: result.rows[i].chicken_pox,
                measles: result.rows[i].measles,
                hepatitis_b: result.rows[i].hepatitis_b
            };
        }
        res.send(ret);
    }), function (error) {
        console.log("Error is ", error);
    };
    // console.log(ret);
    // if (!err) {
    // 	console.log(res.rows);
    // } else {
    // 	console.log(err);
    // }
    // res.json({
    //   message: 'Hello from server!',
    //   msg2: 'how's it going?'
    // });
});
app.listen(3000, function () {
    console.log('Server listening on port 3000');
});
// let date = new Date();
// date = new Date('2001-01-01');
// console.log(date);
