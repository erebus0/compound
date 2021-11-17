require('dotenv').config();
process.env.INFURA_URL;
// const Koa = require ('koa');
const express = require('express');
// const app = new Koa();
const app = new express(); 
const router = require('./router.js');

/* CORS HEADER MIDDLEWARE */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", `${process.env.FRONT_END_URI}`);
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(router);

app.get('/', (req, res) => {
    res.send("Hello World");
});

port = process.env.PORT || 5000;
app.listen(port, () => {
     console.log(`Running on ${port}`);
});