import express from 'express'
import {Client} from 'pg'

// const express = require('express')
// const { Client } = require('pg')

const app = express();

const client = new Client({
	host: 'localhost',
	port: 5432,
	user: 'admin',
	password: 'passwd',
	database: 'phi_db'
})

client.connect().then();

app.get('/patientData', (req, res) => {

	client.query('SELECT * FROM patients', (err, res) => {
		
		const ret: Record<number, {name: string, dob: Date, phone_num: number, addr: string, weight: number, height: number, chicken_pox: boolean, measles: boolean, hepatitis_b: boolean}> = {}
		for(let i = 0; i < res.rows.length; i++) {
			ret[i] = {
				name: res.rows[i].name,
				dob: res.rows[i].dob,
				phone_num: res.rows[i].phone_num,
				addr: res.rows[i].addr,
				weight: res.rows[i].weight,
				height: res.rows[i].height,
				chicken_pox: res.rows[i].chicken_pox,
				measles: res.rows[i].measles,
				hepatitis_b: res.rows[i].hepatitis_b
			}
		}
		res.send(ret);

		
		// console.log(ret);
		// if (!err) {
		// 	console.log(res.rows);
		// } else {
		// 	console.log(err);
		// }
	})

		// res.json({
		//   message: 'Hello from server!',
		//   msg2: 'how's it going?'
		// });
})
	

app.listen(3000, (req, res) => {
	console.log('Listening on port 3000');
})

// let date = new Date();

// date = new Date('2001-01-01');
// console.log(date);

