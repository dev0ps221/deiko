
const COOKIES = ()=>{
    let cookieArr = document.cookie.split(';').map(cook=>cook.trim().split('='))
    let cookies = {}
    if(cookieArr.length){
        cookieArr.forEach(
            cookie=>{
                if(cookie.length>1){
                    cookies[cookie[0]] = cookie[1].trim()
                }
            }
        )
    }
    return cookies
}
const isConnected = ()=>{
    return COOKIES().hasOwnProperty('connected')
}
