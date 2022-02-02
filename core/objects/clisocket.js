const path = require('path')
const base = require(path.join(__dirname,'base'))

module.exports= class extends base{
    //CliSocket


    userData({name,id}){
        this.userid = id
        this.userdata = {name,id}
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
                console.log(r)
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
            'userdata',(data)=>{
                this.userData(data)
            }
        )

        this.setListener(
            'doregister',({username,password})=>{
                console.log(username,password,' lets register')
                this.deebee.___register(username,password,registerCallBack)
            }
        )
    
        this.setListener(
            'newConversation',conversationName=>{
                
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