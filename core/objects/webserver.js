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

    getSocketByUser(name){
        let found = null
        this.sockets.forEach(
            sock=>{
                if(sock.userdata.name == name) found = sock
            }
        )
        return found
    }


    getConversation(name){
        let found = null 
        this.conversations.forEach(
            conv=>{
                if(conv.name == name) found = conv
            }
        )
        return found
    }

    configureIo(clisocket,deebee,server){
        this.io.listen(this.server)
        this.io.on(
            'connection',(socket)=>{

                let sockconvs = []
                let username = null
                let sockname = `sock#${this.sockets.length+1}`
                let sock     = new clisocket({sockname,socket,username:null,deebee,server})

                this.sockets.push(sock)

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
                    path.join(this.root,'views','index.html')
                )
            }
        )

        this.app.get(
            '/home',(req,res)=>{
                res.sendFile(
                    path.join(this.root,'views','home.html')
                )
            }
        )

        this.app.get(
            '/logout',(req,res)=>{
                res.sendFile(
                    path.join(this.root,'views','logout.html')
                )
            }
        )
        

    }

    configureDeeBee(){

        this.deebee = this.core.deebee
        
        this.deebee._____registerAction(
            'getConversations',function(cb){
                const req = this.__selectFrom(
                    'conversations',['*'],[[],[]]
                )
                this.db.query(
                    req,cb
                )
            }
        )

        this.deebee._____registerAction(
            'getConversation',function(id,cb){
                const req = this.__selectFrom(
                    'conversations',['*'],[['id'],[id]]
                )
                this.db.query(
                    req,cb
                )
            }
        )

        this.deebee._____registerAction(
            'insertConversation',function(name,cb){
                const req = this.__insertINTO(
                    'conversations',['name'],[`'${name}'`]    
                )
                this.db.query(
                    req,cb
                )
            }
        )


        this.deebee._____registerAction(
            'joinConversation',function (id_conversation,id_user,cb){
                const req = this.__insertReq(
                    'conversation_members',['id_conversation','id_user'],[id_conversation,id_user]
                )
                this.db.query(
                    req,cb
                )
            }
        )
    }

    setConversations(cb){
        this.conversations = []
        this.deebee.getConversations(
            (e,conversations)=>{
                if(e){
                    console.log(e)
                    if(cb)cb(this.conversations)
                }else{
                    if(conversations && conversations.length){
                        conversations.forEach(
                            (conversation,idx)=>{
                                conversation.deebee = this.deebee
                                let conv = new (this.core.getObject('vchat'))(conversation)
                                conv.whenReady(
                                    ()=>{
                                        this.conversations.push(conv)
                                        if(idx+1==conversations.length){
                                            if(cb)cb(this.conversations)
                                        }
                                    }
                                )
                            }
                        )
                    }else{
                        if(cb)cb(this.conversations)
                    }
                }
            }
        )
    }

    getConversations(cb){
        if(cb){
            this.setConversations(
                cb
            )
        }
        return this.conversations
    }

    constructor(data){
        super(data)
        this.sockets = []
        this.users = []
        this.conversations = []
        this.configureApp()
        this.configureRoutes()
        this.configureDeeBee()
        this.setConversations(
            ()=>{
                this.ready = 1
            }
        )
    }


}