let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let date=document.getElementById("Date")
const today =new Date().toLocaleDateString('en-CA');
document.getElementById("Date").value = today;
date.min=today
let selectedDate=today
let dayObj= new Date(selectedDate)
let day = dayObj.getDay()

console.log(rate(day))
console.log(selectedDate)
console.log(days[day])

date.addEventListener("input",(e)=>{
  selectedDate=e.target.value
  dayObj= new Date(selectedDate)
  let day = dayObj.getDay()
  console.log(selectedDate)
  console.log(days[day])
  console.log(rate(day))
  updatedSlots()
})

function updatedSlots() {
  let bookedSlots =bookings[selectedDate] || []
  let availableSlots= available[selectedDate] || []
  for (let i = 0; i < bookedSlots.length; i++) {
    let btn=document.getElementById(bookedSlots[i])
    if (btn) btn.disabled=true 
  }
  for(let i=0;i<availableSlots.length; i++){
    let btn = document.getElementById(availableSlots[i])
    if (btn) btn.disabled = false
  }
}
function rate(day) {
  if(day > 0 && day < 6){
    return 1500
  } else if (day===0 || day===6) {
    return 2000
  }else{
    return "invalid"
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  updatedSlots()
})


function book(){
  var details={
    "Name":document.getElementById('name').value.trim(),
    "Phone_Number":document.getElementById('ph').value.trim(),
    "Email":document.getElementById('email').value.trim(),
    "Date":document.getElementById('Date').value.trim(),
      "slot":document.querySelector('input[name="slots"]:checked') ? document.querySelector('input[name="slots"]:checked').id : null
  }
  if(details.Name != "" && details.Phone_Number != "" && details.Email != "" && details.Date != "" && details.slot != null){
    console.log(details)
  }else{
    if(details.Name === ""){
      document.getElementById('name').style.border= "2px solid red"
    }
    alert("incomplete details")
  }
}