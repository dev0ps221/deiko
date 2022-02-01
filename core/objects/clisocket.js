const path = require('path')
const base = require(path.join(__dirname,'base'))

module.exports= class extends base{
    //CliSocket

    setListener(name,func){
        this.socket.off(
            name,func
        )
        this.socket.on(
            name,func
        )
    }

    setListeners(){

        this.setListener(
            'dologin',({username,password})=>{
                console.log(username,password,' lets login')
                this.deebee.___login(username,password,(e,r)=>{
                    if(e)console.log(e)
                    else{
                        console.log(r)
                    }
                })
            }
        )

        this.setListener(
            'doregister',({username,password})=>{
                console.log(username,password,' lets register')
                this.deebee.___register(username,password,(e,r)=>{
                    if(e)console.log(e)
                    else{
                        console.log(r)
                    }
                })
            }
        )

        this.setListener(
            'conversation'
            ,(data)=>{
                this.server.conversations.push(
                    {id:this.server.conversations.length+1,name:`${data.chatname}#${this.server.conversations.length+1}`,members:[data]}
                )
                sockconvs.push(
                    {id:this.server.conversations.length+1,name:`${data.chatname}#${this.server.conversations.length+1}`,members:[data]}
                )
                
                this.server.post(socket,'/conversation',data)
                socket.broadcast.emit(
                    'conversations',this.server.conversations
                )
                socket.emit(
                    'conversations',this.server.conversations
                )
            }
        )
        this.setListener(
            'joinConversation'
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
                        'conversations',this.server.conversations
                    )
                    
                    socket.emit(
                        'conversations',this.server.conversations
                    )

                }
            }
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
    }
}