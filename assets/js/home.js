
let conversations = []
let listeninterval  = null
let readyForChat    = null
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

function addToConvList(conversation){
    

    function joinConversation(){
        post('joinConversation',{chatname:conversation.name,username:window.username})
    }
    let convelem = document.createElement('li')
    convelem.classList.add('videocall')
    let convname = document.createElement('span')
    convname.innerText = conversation.name
    convname.classList.add('videocall-name')
    convelem.appendChild(convname)
    
    let convjoin = document.createElement('button')
    convjoin.innerText = 'join'
    convjoin.classList.add('videocall-join')
    convelem.appendChild(convjoin)
    
    convjoin.addEventListener(
        'click',joinConversation
    )

    videocalls.querySelector('.list').appendChild(convelem)

}
function updateConversations(){
    videocalls.querySelector('.list').innerText=""
    if(window.conversations){
        window.conversations.forEach(
            addToConvList
        )
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
    '/conversation',({username,chatname})=>{
        window.chatname = chatname
        window.username = username
    }
)
get(
    '/actualconversation',(conv)=>{
        window.actualconversation = conv
        actualconversation.members.forEach(
            member=>{
                if(member.username!=window.username){
                    buildMemberVidView(member)
                }
            }
        )

    }
)
get(
    'conversations',(conversations)=>{
        window.conversations = conversations
        updateConversations()
    }
)
get(
    'username',data=>{
        post(
            'conversations'
        )
        window.username = data.username 
    }
)
create.addEventListener(
    'click',e=>{
        chatnameinput.value? post('newConversation',chatnameinput.value): null
    }
)
listeninterval = setInterval(listenReadyForChat,1000)    
function setMyData(){
    document.self = JSON.parse(COOKIES()['connected'])
    document.querySelector('#myview label').innerText = document.self.name
    post(
        'userdata',document.self
    )
}
if(!isConnected())document.location.href='/'
else{
    setMyData()
}