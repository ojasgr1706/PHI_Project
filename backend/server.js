// import { query } from "express";
var express = require('express');
var Client = require('pg').Client;
var cors = require('cors');
var multipart = require('connect-multiparty');
var multer = require('multer');
var path = require('path');
var file_path = './uploads/';
// var EXT_RE = /(\.[_\-a-zA-Z0-9]{0,16}).*/g;
var multipartMiddleware = multipart({
    uploadDir: file_path
});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, file_path);
    },
    filename: function (req, file, cb) {
        // const { originalname } = file;
        cb(null, file.originalname);
    }
});
var multerMiddleware = multer({ storage: storage });
var formidable = require('formidable');
var exp_formidable = require('express-formidable');
var fs = require('fs');
// import express from 'express';
// import { Client } from 'pg';
// import cors from 'cors';
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
        // console.log(JSON.stringify(result.rows));
        // console.log(result.rows);
        var ret = {};
        for (var i = 0; i < result.rows.length; i++) {
            ret[i] = {
                patient_id: result.rows[i].patient_id,
                name: result.rows[i].name,
                dob: result.rows[i].dob,
                phone_num: result.rows[i].phone_num,
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
});
app.post('/patientData', function (req, res, next) {
    // console.log(req.body);
    var query = "INSERT INTO patients (patient_id, name, dob, phone_num, address, weight, height, chicken_pox, measles, hepatitis_b) VALUES (\n\t\t".concat(req.body.patient_id, ", '").concat(req.body.nam, "', '").concat(req.body.dob, "', ").concat(req.body.phone_num, ", '").concat(req.body.addr, "', ").concat(req.body.weight, ", ").concat(req.body.height, ",\n\t\t").concat(req.body.chicken_pox, ", ").concat(req.body.measles, ", ").concat(req.body.hepatitis_b, ")");
    // console.log(query);
    client.query(query).then(function () {
        res.send({ "response": 'Added' });
    }), function (error) {
        console.log("Error is ", error);
    };
});
app.get('/vendorData', function (req, res) {
    client.query('SELECT * FROM vendor', function (req, result) {
        // console.log(JSON.stringify(result.rows));
        // console.log(result.rows);
        var ret = {};
        for (var i = 0; i < result.rows.length; i++) {
            ret[i] = {
                vendor_id: result.rows[i].vendor_id,
                name: result.rows[i].name,
                // dob: result.rows[i].dob,
                phone_num: result.rows[i].phone_num,
                address: result.rows[i].address
            };
        }
        res.send(ret);
    }), function (error) {
        console.log("Error is ", error);
    };
});
app.post('/clinicianData/uploadfile', multerMiddleware.single('file'), function (req, res) {
    console.log("file uploaded");
    return res.send({ status: 'OK' });
});
app.post('/clinicianData/uploadfiledetails', function (req, res) {
    // console.log(req.files);
    // return res.send({status: 'OK'});
    console.log("details uploaded");
    var query = "INSERT INTO files values (".concat(req.body.clinician_id, ", ").concat(req.body.vendor_id, ", '").concat(file_path).concat(req.body.file_name, "');");
    client.query(query).then(function () {
        res.send({ "response": 'Added' });
    }), function (error) {
        console.log("Error is ", error);
    };
});
app.post('/vendorData/addfile', multipartMiddleware, function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        res.write('File has been successfully uploaded');
        res.end();
    });
});
app.post('/vendorData/getfilesdata', function (req, res) {
    // console.log(req.body);
    // console.log('getting files');
    var ret = {};
    var query = "SELECT * FROM files WHERE clinician_id = ".concat(req.body.clinician_id, " and vendor_id = ").concat(req.body.vendor_id, ";");
    client.query(query, function (req, result) {
        for (var i = 0; i < result.rows.length; i++) {
            ret[i] = {
                clinician_id: result.rows[i].clinician_id,
                file_path: result.rows[i].file_path
            };
        }
        res.send(ret);
    }), function (error) {
        console.log("Error is ", error);
    };
});
app.post('/vendorData/downloadfiledata', function (req, res) {
    // const file = path.resolve(__dirname, `./dumps/dump.gz`);
    //No need for special headers
    res.download(req.body.path);
    console.log(req.body.path);
    console.log('file downloaded');
});
app.listen(3001, function () {
    console.log('Server listening on port 3001');
});
// let date = new Date();
// date = new Date('2001-01-01');
// console.log(date);
