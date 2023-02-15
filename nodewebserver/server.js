const express = require('express');
const path = require('path')

// const { Server } = require('http');
const server = express();
const port = 81;
let dirname = __dirname;

//for parsing application/json
server.use(express.json() );

//for parsing application/x-www-form-urlencoded
server.use(express.urlencoded({extended: true}));

server.use(express.static(path.join(dirname, '/public'), {
    extensions:['html','htm']
}));


server.listen(port, () => console.log(`Example web server listening at http://localhost:${port}`));
