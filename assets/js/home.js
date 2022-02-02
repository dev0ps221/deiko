
let conversations = []
let listeninterval  = null
let readyForChat    = null
var context = document.querySelector('canvas').getContext("2d")

function addToConvList(conversation,idx){
    
    const isactual = window.actualconvIdx == idx
    
    function showConversation(){
        document.location.href=`/vchat#${conversation.id}`
    }
    let convelem = document.createElement('li')
    convelem.classList.add('videocall')
    let convname = document.createElement('span')
    convname.innerText = conversation.name
    convname.classList.add('videocall-name')
    convelem.appendChild(convname)
    let convshow = document.createElement('button')
    convshow.innerText = 'show'
    convshow.classList.add('videocall-show')
    convshow.addEventListener(
        'click',showConversation
    )
    
    convelem.appendChild(convshow)
    
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
get(
    'conversations',(conversations)=>{
        if(conversations.length){
            window.actualconvIdx = window.hasOwnProperty('actualconvIdx') ? window.actualconvIdx : 0  
        }
        window.conversations = conversations
        updateConversations()
    }
)
create.addEventListener(
    'click',e=>{
        chatnameinput.value? post('newConversation',chatnameinput.value): null
    }
)
function setMyData(){
    document.self = JSON.parse(COOKIES()['connected'])
    post(
        'userdata',document.self
    )
}
if(!isConnected())document.location.href='/'
else{
    setMyData()
}