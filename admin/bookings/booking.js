var curentBookings=document.getElementById("current-data")
var previousBookings=document.getElementById("previous-data")
var selectedDateCurrent
var selectedDatePrevious
var dateElementCurrent=document.getElementById("currentDate")
var dateElementPrevious=document.getElementById("previousDate")

document.addEventListener("DOMContentLoaded", function (){
  var today= new Date().toLocaleDateString('en-CA')
  selectedDateCurrent=today
  selectedDatePrevious=today
  dateElementCurrent.value=selectedDateCurrent
  getCurrrent(selectedDateCurrent)
  dateElementPrevious.value=selectedDatePrevious
  getPrevious(selectedDatePrevious)
  
})
    
dateElementCurrent.addEventListener("input",(e)=>{
  selectedDateCurrent=e.target.value
  console.log("current="+selectedDateCurrent)
  getCurrrent(selectedDateCurrent)
})
dateElementPrevious.addEventListener("input",(e)=>{
  selectedDatePrevious=e.target.value
  console.log("current="+selectedDatePrevious)
  getPrevious(selectedDatePrevious)
})

function getCurrrent(date) {
  db.collection("bookings").doc("active").collection(date).where("status","==","active").onSnapshot((slot)=>{
    curentBookings.innerHTML=""
    slot.forEach((data)=>{
      var details=data.data()
      var id=data.id
      var card=document.createElement("div")
      var serviceCard=document.createElement("div")
      var time=details.time
      card.id="booking-card"
      serviceCard.id="service-card"
      card.innerHTML=`<h3>${details.name}</h3><p>Email: ${details.email}<br>Phone: ${details.phone}</p><h4>Date: ${details.date}</h4>`
      serviceCard.innerHTML=`<p>${time}</p><h3>Total:${details.totalamount}</h3>`
      card.appendChild(serviceCard)
      card.innerHTML+=`<span><button  class="cardAction" onclick="finish('${data.id}','${details.email}','${details.date}')">Finish Booking</button></span><span><button  class="cardAction-delete" onclick="del('${data.id}','${details.date}')">Cancel Booking</button>`
      curentBookings.appendChild(card)
    
    })
  })
}

function getPrevious (date) {
  db.collection("bookings").doc("active").collection(date).where("status","==","finished").onSnapshot((slot)=>{
    previousBookings.innerHTML=""
    slot.forEach((data)=>{
      var details=data.data()
      var id=data.id
      var card=document.createElement("div")
      var serviceCard=document.createElement("div")
      var time=details.time
      card.id="booking-card"
      serviceCard.id="service-card"
      card.innerHTML=`<h3>${details.name}</h3><p>Email: ${details.email}<br>Phone: ${details.phone}</p><h4>Date: ${details.date}</h4>`
      serviceCard.innerHTML=`<p>${time}</p><h3>Total:${details.totalamount}</h3>`
      card.appendChild(serviceCard)
      previousBookings.appendChild(card)
    
    })
  })
}

function finish(id,email,date) {
  console.log(id)
  console.log(date+" "+id)
  var update={
    status:"finished"
  }
  db.collection("bookings").doc("active").collection(date).doc(id).update(update).then(()=>{
    alert("Updated")
    db.collection("Users").doc(email). collection("active_booking").doc(date+"\t"+id).update(update).then(()=>{
      console.log("updated")
    }).catch((error)=>{
      console.log(error.message)
    })
  }).catch((error)=>{
    console.log(error.message)
  })
}
function del(id, date) {
  db.collection("bookings").doc("active").collection(date).doc(id).delete().then(()=>{
    alert("Booking cancelled ")
  }).catch((error)=>{
    console.log(error.message)
  })
}