function register() {
  var nameInput = document.getElementById("name");
  var phoneInput = document.getElementById("phone");
  var emailInput = document.getElementById("email");

  var data = {
    name: nameInput ? nameInput.value.trim() : "",
    phone: phoneInput ? phoneInput.value.trim() : "",
    email: emailInput ? emailInput.value.trim() : "",
    sex: document.getElementById("gender").value,
    tsize:document.getElementById("tshirt").value,
    status: "waiting",
    type:"solo",
    gender: document.getElementById("gender").value,
    address: document.getElementById("address").value
  };

  if (
    !data.name ||
    !data.phone ||
    !data.email ||
    data.sex === ""||
    data.tsize === "" || data.gender === ""
  ) {
    alert("Please fill in your details and select at least one time slot.");
    return;
  }
  else{
    db.collection("marathon").doc(data.email).set(data).then(()=>{
      alert("Applied for registration")
    }).catch((error)=>{
      alert(error.message)
    })
  }

}