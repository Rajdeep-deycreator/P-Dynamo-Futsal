function login(email, password) {
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(()=>{
    auth.signInWithEmailAndPassword(email, password ).then(()=>{
      alert("loged In")
      localStorage.setItem("FutsalEmail",email)
      localStorage.setItem("FutsalLogin","true")
      window.location.href="/index.html"
    }).catch((error)=>{
      alert("Error Signing In"+ error.message)
    })
  }).catch((error)=>{
    alert(error.message)
  })
}

function loginbtn() {
  var email=document.getElementById("loginEmail").value
  var password=document.getElementById("loginPassword").value
  console.log(email,password)
  login(email,password)
}