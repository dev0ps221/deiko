const formbuttons = document.querySelectorAll('#loginforms #form #buttons button')
const formview   = document.querySelector('#loginforms #form #content .data')
const formlegend   = document.querySelector('#loginforms #form #content legend')
const actionbutton   = document.querySelector('#loginforms #action button')

let viewData = {
    register:{
        username:null,password:null
    },login:{
        username:null,password:null
    }
}

function updateViewData(){
    const username = document.querySelector('#username') ? document.querySelector('#username').value : null
    const password = document.querySelector('#password') ? document.querySelector('#password').value : null
    viewData[getActualFormView()] = {
        username,password
    }
}

function postViewData(){
    updateViewData()
    const {username,password} = viewData[getActualFormView()]
    if(username&&password){
        post(
            `do${getActualFormView()}`,({username,password})
        )
    }
}

const showView = {
    register:function(){
        const usernamebox = usernameBox(
            updateViewData,()=>{

            }
        )
        const passwordbox = passwordBox(
            updateViewData,()=>{

            }
        )
        formview.appendChild(usernamebox)
        formview.appendChild(passwordbox)
        // alert('let s show register view')

    },login:function(){
        
        const usernamebox = usernameBox(
            updateViewData,()=>{

            }
        )
        const passwordbox = passwordBox(
            updateViewData,()=>{

            }
        )
        formview.appendChild(usernamebox)
        formview.appendChild(passwordbox)
        // alert('let s show login view')
    
    }
}

function usernameBox(onChange=null,onClick=null){

    const usernameelem = document.createElement('div')
    usernameelem.classList.add('field')
    const usernamebox = document.createElement('input')
    usernamebox.type = 'text'
    usernamebox.id='username'
    usernamebox.placeholder='identifiant'
   
    if(onClick)usernamebox.addEventListener(
        'click',onClick
    )
    if(onChange)usernamebox.addEventListener(
        'change',onChange
    )

    usernameelem.appendChild(usernamebox)
    return usernameelem
}

function passwordBox(onChange=null,onClick=null){
    const passwordelem = document.createElement('div')
    passwordelem.classList.add('field')
    const passwordbox = document.createElement('input')
    passwordbox.type = 'password'
    passwordbox.id='password'
    passwordbox.placeholder='mot de passe'
    
    if(onClick)passwordbox.addEventListener(
        'click',onClick
    )
    if(onChange)passwordbox.addEventListener(
        'change',onChange
    )

    passwordelem.appendChild(passwordbox)
    return passwordelem
}

function clearActualFormView(){
    formbuttons.forEach(
        button=>{
            if(button.classList.contains('actual'))button.classList.remove('actual')
        }
    )
}
function switchActualView(e){
    clearActualFormView()
    e.target.classList.add('actual')
    showActualFormView()
}
function getActualFormView(){
    let found = null
    formbuttons.forEach(
        button=>{
            if(button.classList.contains('actual')) found = button
        }
    )
    return found.innerText.match('connecter')?'login':'register'
}
function showActualFormView(){
    formview.innerText = ""
    if(document.querySelector('#username'))document.querySelector('#username').value = ""
    if(document.querySelector('#password'))document.querySelector('#password').value = ""
    updateViewData()
    showView[getActualFormView()]()
    listenSubmitData()
}
function listenFormViewSwitchs(){
    formbuttons.forEach(
        button=>{
            button.addEventListener(
                'click',switchActualView
            )
        }
    )
}

function listenSubmitData(){
    actionbutton.removeEventListener(
        'click',postViewData
    )
    actionbutton.addEventListener(
        'click',postViewData
    )
}


get(
    'registerFail',message=>{
        alert(message)
    }
)

get(
    'loginSuccess',r=>{
        document.cookie = `connected=${JSON.stringify(r).toString()}`
        document.location.reload()
    }
)

listenFormViewSwitchs()
showActualFormView()
if(isConnected()) document.location.href='/home'