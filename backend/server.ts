// import { query } from "express";
const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const multipart = require('connect-multiparty');
const multer = require('multer');
const path = require('path');
const file_path = './uploads/';


// var EXT_RE = /(\.[_\-a-zA-Z0-9]{0,16}).*/g;
const multipartMiddleware = multipart({
    uploadDir: file_path,
	// filename: function(filename, callback){
	// 	var name = filename.replace(EXT_RE, "");
	// 	callback(name+'-YEAH.png');
	//   }
});

const storage = multer.diskStorage({
	destination: (req, file, cb)  => {
		cb(null, file_path);
	},
	filename : (req, file, cb) => {
		// const { originalname } = file;
		cb(null, file.originalname);
	}
});

const multerMiddleware = multer({ storage: storage });

const formidable = require('formidable');
const exp_formidable = require('express-formidable');

const fs = require('fs');
// import express from 'express';
// import { Client } from 'pg';
// import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }), express.json(), cors());

const client = new Client({
	host: 'localhost',
	port: 5432,
	user: 'admin',
	password: 'passwd',
	database: 'phi_db'
})

client.connect().then();

app.get('/patientData', (req, res) => {

	client.query('SELECT * FROM patients', (req, result) => {

		// console.log(JSON.stringify(result.rows));
		// console.log(result.rows);
		const ret: Record<number, {patient_id: number, name: string, dob: Date, phone_num: number, addr: string, weight: number, height: number, chicken_pox: boolean, measles: boolean, hepatitis_b: boolean }> = {}
		for (let i = 0; i < result.rows.length; i++) {
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
			}
		}
		res.send(ret)
	}), (error: any) => {
		console.log("Error is ", error);
	}
})

app.post('/patientData', (req, res, next) => {
	// console.log(req.body);
	var query: string = `INSERT INTO patients (patient_id, name, dob, phone_num, address, weight, height, chicken_pox, measles, hepatitis_b) VALUES (
		${req.body.patient_id}, '${req.body.nam}', '${req.body.dob}', ${req.body.phone_num}, '${req.body.addr}', ${req.body.weight}, ${req.body.height},
		${req.body.chicken_pox}, ${req.body.measles}, ${req.body.hepatitis_b})`;
	// console.log(query);
	client.query(query).then(() => {
		res.send({"response":'Added'});
	}), (error: any) => {
		console.log("Error is ", error);
	}
})

app.get('/vendorData', (req, res) => {

	client.query('SELECT * FROM vendor', (req, result) => {

		// console.log(JSON.stringify(result.rows));
		// console.log(result.rows);
		const ret: Record<number, { vendor_id: number, name: string, phone_num: number, address: string}> = {}
		for (let i = 0; i < result.rows.length; i++) {
			ret[i] = {
				vendor_id: result.rows[i].vendor_id,
				name: result.rows[i].name,
				// dob: result.rows[i].dob,
				phone_num: result.rows[i].phone_num,
				address: result.rows[i].address,
			}
		}
		res.send(ret)
	}), (error: any) => {
		console.log("Error is ", error);
	}
})

app.post('/clinicianData/uploadfile', multerMiddleware.single('file'),(req, res) => {
	console.log("file uploaded");
	return res.send({status: 'OK'});
})

app.post('/clinicianData/uploadfiledetails',(req, res) => {
	// console.log(req.files);
	// return res.send({status: 'OK'});
	console.log("details uploaded");
	var query: string = `INSERT INTO files values (${req.body.clinician_id}, ${req.body.vendor_id}, '${file_path}${req.body.file_name}');`;
	client.query(query).then(() => {
		res.send({"response":'Added'});
	}), (error: any) => {
		console.log("Error is ", error);
	}
})

app.post('/vendorData/addfile', multipartMiddleware, (req, res) => {
	var form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
		res.write('File has been successfully uploaded');
		res.end();
	});
})

app.post('/vendorData/getfilesdata', (req, res) => {
	// console.log(req.body);
	// console.log('getting files');
	const ret: Record<number, { clinician_id: number, file_path: string}> = {}
	var query: string = `SELECT * FROM files WHERE clinician_id = ${req.body.clinician_id} and vendor_id = ${req.body.vendor_id};`;
	client.query(query, (req,result) => {
		for (let i = 0; i < result.rows.length; i++) {
			ret[i] = {
				clinician_id: result.rows[i].clinician_id,
				file_path: result.rows[i].file_path,
			}
		}
		res.send(ret);
	}), (error: any) => {
		console.log("Error is ", error);
	}
})

app.post('/vendorData/downloadfiledata', (req,res) =>{

	// const file = path.resolve(__dirname, `./dumps/dump.gz`);
    //No need for special headers
    res.download(req.body.path);
	console.log(req.body.path);
	console.log('file downloaded');
})


app.listen(3001, () => {
	console.log('Server listening on port 3001');
})

// let date = new Date();

// date = new Date('2001-01-01');
// console.log(date);

