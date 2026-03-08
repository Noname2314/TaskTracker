let time = 0

function updateTimer(){

time--

if(time < 0) return

let m = Math.floor(time/60)
let s = time%60

document.getElementById("overlay-timer").innerText =
`${m}:${s.toString().padStart(2,'0')}`

}

setInterval(updateTimer,1000)

window.startOverlay = function(seconds){

time = seconds

}