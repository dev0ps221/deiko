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

    configureIo(clisocket){



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
                let sock     = new clisocket({sockname,socket,username:null})

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