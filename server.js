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
        core.server = new (core.getObject('webserver'))({server,io,express,chats,io,app,root,path,port})
        core.server.whenReady(
            ()=>{
                console.log('vweb server is ready to start')
                core.server.listen()
            }
        )
        core.server.when(
            'listening',(server)=>{
                console.log('server listening on ...',server.port)
                core.server.configureIo()
            }
        )
    }
)
