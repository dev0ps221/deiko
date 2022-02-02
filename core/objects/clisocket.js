const path = require('path')
const base = require(path.join(__dirname,'base'))

module.exports= class extends base{
    //CliSocket


    userData({name,id}){
        this.userdata = {name,id}
        this.userid = this.userdata.id
        this.id     = this.userid
        console.log('got my data')
    }

    setListener(name,func){
        this.socket.off(
            name,func
        )
        this.socket.on(
            name,func
        )
    }

    setListeners(){

        let sock = this.socket
        function loginCallBack(e,r){
            if(e){   
                e = 'echec de la connexion réessayez plus tard..'
                sock.emit(
                    'loginFail',e
                )
            }else{
                if(!r.length){
                    e = 'echec de la connexion réessayez plus tard..'
                    sock.emit(
                        'loginFail',e
                    )
                    return
                }
                sock.emit(
                    'loginSuccess',r[0]
                )
            }
        }

        function registerCallBack(e,r){
            if(e){
                console.log(e)
                e = 'echec de l\'inscription réessayez plus tard..'
                sock.emit(
                    'registerFail',e
                )
            }
            else{
                if(!r.insertId){
                    e = 'echec de l\'inscription réessayez plus tard..'
                    sock.emit(
                        'registerFail',e
                    )
                    return
                }
                this.deebee.___login(username,password,loginCallBack)
            }
        }

        this.setListener(
            'dologin',({username,password})=>{
                this.deebee.___login(username,password,loginCallBack)
            }
        )

        this.setListener(
            'mystream',({data,conv})=>{
                this.joinRoom(conv)
                this.doEmit('userStream',{user:this.userdata,data},conv)
                console.log('let lists all sockets and all conversations')
                console.log('then compare all conversations members to socket users')
                console.log('then compare all conversations members to socket users')

            }
        )

        this.setListener(
            '/getConv',id=>{
                this.getVchat(id)
            }
        )

        this.setListener(
            'userdata',(data)=>{
                this.userData(data)
            }
        )

        this.setListener(
            'doregister',({username,password})=>{
                this.deebee.___register(username,password,registerCallBack)
            }
        )
    
        this.setListener(
            'newConversation',conversationName=>{
                this.deebee.insertConversation(conversationName,(e,r)=>{
                    if(e){
                        console.log(e)
                    }else{
                        if(r.insertId){
                            this.deebee.joinConversation(
                                r.insertId,this.userdata.id,(er,re)=>{
                                    if(er)console.log(er)
                                    else{
                                        console.log(`user ${this.userdata.id} joined conv#${r.insertId}`)
                                    }
                                    this.getConversations()
                                }
                            )
                            this.getConversations()
                        }
                    }
                })
            }
        )
    }

    getConversations(){
        this.server.getConversations(
            (conversations)=>{
                this.socket.emit(
                    'conversations'
                    ,conversations.map(conv=>conv.get())
                )
            }
        )
    }

    getVchat(id){
        this.socket.emit(
            'getConv',
            this.server.getConversationById(id)
        )
    }

    joinRoom(roomname){
        this.socket.join(roomname)
    }

    doEmit(name,data,room=false){
        (room?this.io.to(room):this.socket).emit(
            name,data
        )
    }

    constructor(data){
        super(data)
        this.setListeners()
        this.getConversations()
    }
}