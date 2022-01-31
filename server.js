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
const core = require(path.join(__dirname,'core/core'))
function get(socket,...data){
    socket.on(
        ...data
    )
}
function post(socket,...data){
    socket.emit(
        ...data
    )
}
function startServer(error){
    let conversations = []
    let users         = []
    let sockets       = []

    function getSocket(name){
        let found = null
        sockets.forEach(
            sock=>{
                if(sock.sockname == name) found = sock
            }
        )
        return found
    }


    function getSocketByUser(name){
        let found = null
        sockets.forEach(
            sock=>{
                if(sock.username == name) found = sock
            }
        )
        return found
    }


    function getConversation(name){
        let found = null 
        conversations.forEach(
            conv=>{
                if(conv.name == name) found = conv
            }
        )
        return found
    }

    io.listen(server)
    io.on(
        'connection',(socket)=>{
            let sockconvs = []
            let username = null
            let sockname = `sock#${sockets.length+1}`
            sockets.push({sockname,socket,username:null})
            get(
                socket
                ,'username'
                ,(data)=>{
                    console.log('got username')
                    username = data.username
                    if(getSocket(sockname)){
                        getSocket(sockname).username = username
                    }
                    users.push(data)
                    post(socket,'username',data)
                }
            )
            get(
                socket
                ,'conversation'
                ,(data)=>{
                    conversations.push(
                        {id:conversations.length+1,name:`${data.chatname}#${conversations.length+1}`,members:[data]}
                    )
                    sockconvs.push(
                        {id:conversations.length+1,name:`${data.chatname}#${conversations.length+1}`,members:[data]}
                    )
                    
                    post(socket,'/conversation',data)
                    socket.broadcast.emit(
                        'conversations',conversations
                    )
                    socket.emit(
                        'conversations',conversations
                    )
                }
            )
            get(
                socket
                ,'joinConversation'
                ,data=>{
                    let conv = getConversation(data.chatname)
                    if(conv){
                        
                        conv.members.push(data)
                        
                        post(socket,'/conversation',data)
                        
                        post(
                            socket
                            ,'joinConversation'
                            ,conv
                        )

                        conv.members.forEach(
                            member=>{
                                
                                console.log(member.username)
                                
                                if(getSocketByUser(member.username)) getSocketByUser(member.username).socket.emit(
                                    '/actualconversation',conv
                                )

                            }
                        )

                        socket.broadcast.emit(
                            'conversations',conversations
                        )
                        socket.emit(
                            'conversations',conversations
                        )
                    }
                }
            )
            socket.broadcast.emit(
                'conversations',conversations
            )
            socket.emit(
                'conversations',conversations
            )
        }
    )

    app.use(
        '/sio',express.static(path.join(__dirname,'node_modules/socket.io/client-dist/socket.io.min.js'))
    )

    app.use(
        '/',express.static(path.join(__dirname,'assets'))
    )

    if(error)console.log(error)
    else{
        console.log(`listening on port ${port}`)
    }
}

app.get(
    '/',(req,res)=>{
        res.sendFile(
            path.join(__dirname,'views','home.html')
        )
    }
)

server.listen(
    port,startServer
)


new core()