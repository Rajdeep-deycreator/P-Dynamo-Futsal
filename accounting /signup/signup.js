function signup(){
  var details={
    Name:document.getElementById('Name').value.trim(),
    Phone_Number:document.getElementById('ph').value.trim(),
    Email:document.getElementById('Email').value.trim(),
    Created : new Date()
  }
  var password=document.getElementById("Password").value
  var confirm=document.getElementById("confirmPassword").value
  if(details.Name != "" && details.Phone_Number != "" && details.Email != "" && password === confirm){
    console.log(details)
    auth.createUserWithEmailAndPassword(details.Email,password).then(function(userCredentials){
      var user=userCredentials.user
      return db.collection("Users").doc(details.Email).set(details).then(()=>{
        alert("signed in successfully ")
        login(details.Email, password)
      }).catch((error)=>{
        alert(error.message)
      })
    }).catch((error=>{
      alert("error signing up")
    }))
  }else{
    if(details.Name === ""){
      document.getElementById('Name').style.border="2px solid red"
    }else if (details.Phone_Number === ""){
      document.getElementById('ph').style.border="2px solid red"
    } else if (details.Email === "") {
      document.getElementById('Email').style.border="2px solid red"
    }
    alert("incomplete details")
  }
}