
const COOKIES = ()=>{
  let cookieArr = document.cookie.split(';').map(cook=>cook.trim().split('='))
  let cookies = {}
  cookieArr.forEach(
    cookie=>{
      cookies[cookie[0]] = cookie[1].trim()
    }
  )
  return cookies
}
const isConnected = ()=>{
  return COOKIES().hasOwnProperty('connected')
}
