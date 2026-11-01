var filter=document.getElementById("filter").value
var data=document.getElementById("usersTableBody")
var number=0
function retriveSolo(filter){
  data.innerHTML=""
  if(filter === "all"){
  db.collection("marathon").where("type","==","solo").onSnapshot((info)=>{
    data.innerHTML=""
    info.forEach((information)=>{
      number+=1
      details=information.data()
      data.innerHTML += `<tr><td>${number}</td><td>${details.name}</td><td><a href=tel:${details.phone}>${details.phone}</a></td><td>${details.email}</td><td>${details.tsize}</td><td>${details.address}</td><td>${details.gender}</td><td>${details.status}</td><td><input
        type="button" value='approve' id='approve'onclick="approve('${details.email}')"/></td></tr>`
    })
  })
  }else{
    
    db.collection("marathon").where("type","==","solo").where("status","==",filter).onSnapshot((info)=>{
      info.forEach((information)=>{
        details = information.data()
        data.innerHTML += `<tr><td>${number}</td><td>${details.name}</td><td><a href=tel:${details.phone}>${details.phone}</a></td><td>${details.email}</td><td>${details.tsize}</td><td>${details.address}</td><td>${details.gender}</td><td>${details.status}</td><td><input
        type="button" value='approve' id='approve'onclick="approve('${details.email}')"/></td></tr>`
      })
    })
  }
}

document.getElementById("filter").addEventListener("change",()=>{
  filter=document.getElementById("filter").value
  retriveSolo(filter)
})

document.addEventListener("DOMContentLoaded",() => {
    retriveSolo(filter)
})
function approve(id){
  db.collection("marathon").doc(id).update({status:"approved"}).then(()=>{
    alert("approved")
  }).catch((error)=>{
    console.log(error.message)
  })
}