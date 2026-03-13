function switchSection(id, btn=null){

document.querySelectorAll(".section").forEach(sec=>{
sec.classList.remove("active")
sec.style.display="none"
})

const target = document.getElementById(id)

if(target){
target.classList.add("active")
target.style.display="block"
}

document.querySelectorAll(".nav-btn").forEach(b=>{
b.classList.remove("active")
})

if(btn){
btn.classList.add("active")
}

}

window.addEventListener("DOMContentLoaded", () => {
switchSection("home");
})

// ======================
// RESET TASKS
// ======================

function resetTasks(){

if(!confirm("Сбросить все задания?")){
return
}

taskState = {
solo: [],
pair: [],
faction: []
}

saveTasks()

renderTasks(currentTab)
updateBP()

}

// ======================
// RESET MODAL
// ======================

function openResetModal(){
document.getElementById("reset-modal").style.display="flex"
}

function closeResetModal(){
document.getElementById("reset-modal").style.display="none"
}

function confirmReset(){

taskState={
solo:[],
pair:[],
faction:[]
}

saveTasks()
renderTasks(currentTab)
updateBP()

closeResetModal()

}