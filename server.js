const express = require('express')
const mysql = require('mysql')
const http = require('http')
const app = new express()
const server = http.createServer(app)
const port = process.env.PORT||80
const path = require('path')
const sio  = require('socket.io')
const io   = sio()
const chats = []
const core = new (require(path.join(__dirname,'core/core')))
const root = path.join(__dirname)


core.whenReady(
    ()=>{
        core.server = new (core.getObject('webserver'))({server,io,express,chats,io,app,root,path,port,core})
        core.server.whenReady(
            ()=>{
                core.server.listen()
            }
        )
        core.server.when(
            'listening',(server)=>{
                console.log('server listening on ...',server.port)
                core.server.configureIo(core.getObject('clisocket'),core.deebee,core.server)
            }
        )
    }
)

//network stuff
const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}