let listeninterval  = null
let readyForChat    = null
var context = document.querySelector('canvas').getContext("2d")

function listenStart(){
    document.querySelector('#start').addEventListener(
        'click',startMyVideo
    )
}

async function startMyVideo(e){

    let camera_stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
	
    document.querySelector('#myview video').srcObject = camera_stream;
    document.querySelector('#myview video').play()
    document.querySelector('#myview video').addEventListener(
        'stream',e=>{
            console.log("li ngey share")
        }
    )
 
    shareMyVideo(camera_stream)

}

async function shareMyVideo(camera_stream){

    window.mystream = setInterval(
        ()=>{
            context.drawImage(document.querySelector('#myview video'),0,0,context.width, context.height)
            post('mystream',{data:document.querySelector('canvas').toDataURL('image/webp'),conv:window.conversations[actualconvIdx].name})
        }
    ,120)

}

function listenReadyForChat(){

    if(readyForChat){
        listenStart()
        clearInterval(listeninterval)
        return
    }
    if(!window.chatname){
        if(!listeninterval) listeninterval = setInterval(listeninterval,2000)
        return
    }
    if(listeninterval){
        readyForChat = 1
        return
    }

}

function buildMemberVidView(member){

    const memberbox = document.createElement('div')
    memberbox.classList.add('member')
    
    const viewbox = document.createElement('div')
    viewbox.classList.add('view')
    
    const figurebox = document.createElement('figure')
    figurebox.classList.add('videobox')
    
    const label = document.createElement('label')
    label.innerHTML = member.username


    const video = document.createElement('video')
    
    figurebox.appendChild(video)
    viewbox.appendChild(label)
    viewbox.appendChild(figurebox)
    memberbox.appendChild(viewbox)
    members.querySelector('#list').appendChild(memberbox)

}
get(
    'userStream',({user,data})=>{
        console.log('got stream data from user ',user)
        console.log(data)
    }
)
listeninterval = setInterval(listenReadyForChat,1000)    
function setMyData(){
    document.self = JSON.parse(COOKIES()['connected'])
    document.querySelector('#myview label').innerText = document.self.name
    post(
        'userdata',document.self
    )
    _conversation()
}
function _conversation(){
    post(
        '/getConv',{id:parseInt(document.location.hash.replace('#',''))}
    )
    get(
        'getConv',conv=>{
            if(conv){
                window.conv = conv
                window.chatname = conv.name
                alert('cool')
            }
        }
    )
}
if(!isConnected())document.location.href='/'
else{
    setMyData()
}