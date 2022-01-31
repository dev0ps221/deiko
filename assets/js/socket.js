let sock = io.connect('/')
const post = (target,data,cb=()=>{})=>{
  sock.emit(
    target,data
  )
  get(
    `${target}Res`,cb
  )
}
const get = (target,cb)=>{
  sock.on(
    target,cb
  )
}
window.onload=function(){
  if(COOKIES().hasOwnProperty('uuid')){
    sock.uuid = COOKIES().uuid
    if(window.hasOwnProperty('commande_actuelle')){
      commande_actuelle.uuid = sock.uuid
    }
  }

  if(sock.uuid){
    post(
      'uuid',sock.uuid
    )
  }

  get(
    'uuidRes',({uuid})=>{
      if(!sock.uuid){
        sock.uuid = uuid
        document.cookie=`uuid=${uuid}`
      }
      post(
        'uuid',sock.uuid
      )
    }
  )


}