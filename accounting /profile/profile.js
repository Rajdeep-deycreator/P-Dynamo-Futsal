document.addEventListener("DOMContentLoaded", function() {
    var profileName = document.getElementById("profileName")
    profileName.innerHTML = name
    var profileEmail = document.getElementById("profileEmail")
    profileEmail.innerHTML = localStorage.getItem("FutsalEmail")
    retriveService()
    retrivePreviousService()
});

function logout(param) {
    auth.signOut()
    localStorage.removeItem("FutsalLogin")
    localStorage.removeItem("FutsalEmail")
    window.location.replace("/")
}
function retriveService(){
    var current=document.getElementById("currentBookingsList")
    db.collection("Users").doc(email). collection("active_booking").where("status","==","active").get().then((data)=>{
        current.innerHTML=""
        data.forEach((information)=>{
            var card=document.createElement('div')
            var data=information.data()
            console.log(data)
            var time= data.time
            card.innerHTML=`<h1><span>${data.date}</span></h1><div id="serviceSummary"<p>Slot:<br>${time}<br></div>Ammount:<span>\t ${data.totalamount}</span></p>`
            card.id="serviceCard"
        
            current.appendChild(card)
        })
    }).catch((error)=>{
        console.log(error.message)
    })
}

function retrivePreviousService(){
    var previous=document.getElementById("previousBookingsList")
    db.collection("Users").doc(email). collection("active_booking").where("status","==","finished").get().then((data)=>{
        previous.innerHTML=""
        data.forEach((information)=>{
            var card=document.createElement('div')
            var data=information.data()
            console.log(data)
            var servic= data.time
            card.innerHTML=`<h1><span>\t ${information.id}</span></h1><div id="serviceSummary"><p>Slot:<br>${servic}<br></div>Ammount:<span>${data.totalamount}</span></p><button href='https://maps.app.goo.gl/kfQpnQ4taVh3t4GQ6' class="reviewButton" onclick=review()>Rate us on Google</button>`
            card.id="serviceCard"
        
            previous.appendChild(card)
        })
    }).catch((error)=>{
        console.log(error.message)
    })
}

function review(){
    window.location.href="https://maps.app.goo.gl/kfQpnQ4taVh3t4GQ6"
}


