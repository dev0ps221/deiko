const path = require('path')
const base = require(path.join(__dirname,'base'))

module.exports = class extends base{
    //webserver


    configureApp(){

        this.app.use(
            '/sio',this.express.static(this.path.join(this.root,'node_modules/socket.io/client-dist/socket.io.min.js'))
        )

        this.app.use(
            '/',this.express.static(this.path.join(this.root,'assets'))
        )

    }

    listen(){
        this.server.listen(
            this.port,(err)=>{
                if(err){
                    console.log(err)
                    return
                }
                this.trigger(
                    'listening',this
                )
            }
        )
    }

    get(socket,...data){
        socket.on(
            ...data
        )
    }
    
    post(socket,...data){
        socket.emit(
            ...data
        )
    }
    
    getSocket(name){
        let found = null
        this.sockets.forEach(
            sock=>{
                if(sock.sockname == name) found = sock
            }
        )
        return found
    }

    configureIo(){



        function getSocketByUser(name){
            let found = null
            this.sockets.forEach(
                sock=>{
                    if(sock.username == name) found = sock
                }
            )
            return found
        }


        function getConversation(name){
            let found = null 
            this.conversations.forEach(
                conv=>{
                    if(conv.name == name) found = conv
                }
            )
            return found
        }

        this.io.listen(this.server)
        this.io.on(
            'connection',(socket)=>{
                let sockconvs = []
                let username = null
                let sockname = `sock#${this.sockets.length+1}`
                this.sockets.push({sockname,socket,username:null})
                this.get(
                    socket
                    ,'username'
                    ,(data)=>{
                        console.log('got username')
                        username = data.username
                        if(this.getSocket(sockname)){
                            this.getSocket(sockname).username = username
                        }
                        this.users.push(data)
                        this.post(socket,'username',data)
                    }
                )
                this.get(
                    socket
                    ,'conversation'
                    ,(data)=>{
                        this.conversations.push(
                            {id:this.conversations.length+1,name:`${data.chatname}#${this.conversations.length+1}`,members:[data]}
                        )
                        sockconvs.push(
                            {id:this.conversations.length+1,name:`${data.chatname}#${this.conversations.length+1}`,members:[data]}
                        )
                        
                        this.post(socket,'/conversation',data)
                        socket.broadcast.emit(
                            'conversations',this.conversations
                        )
                        socket.emit(
                            'conversations',this.conversations
                        )
                    }
                )
                this.get(
                    socket
                    ,'joinConversation'
                    ,data=>{
                        let conv = getConversation(data.chatname)
                        if(conv){
                            
                            conv.members.push(data)
                            
                            this.post(socket,'/conversation',data)
                            
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
                                'conversations',this.conversations
                            )
                            socket.emit(
                                'conversations',this.conversations
                            )
                        }
                    }
                )
                socket.broadcast.emit(
                    'conversations',this.conversations
                )
                socket.emit(
                    'conversations',this.conversations
                )
            }
        )

    }


    configureRoutes(){

        this.app.get(
            '/',(req,res)=>{
                res.sendFile(
                    path.join(this.root,'views','home.html')
                )
            }
        )
        

    }

    constructor(data){
        super(data)
        this.sockets = []
        this.users = []
        this.conversations = []
        this.configureApp()
        this.configureRoutes()
        this.ready = 1
    }


}