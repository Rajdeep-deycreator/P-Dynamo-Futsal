function register() {
  
  var nameInput = document.getElementById("name");
  var phoneInput = document.getElementById("phone");
  var emailInput = document.getElementById("email");
  
  var data = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    sex: document.getElementById("gender").value,
    tsize: document.getElementById("tshirt").value,
    status: "approved",
    type: "solo",
    gender: document.getElementById("gender").value,
    address: document.getElementById("address").value.trim()
  };
  
  if (
    !data.name ||
    !data.phone ||
    !data.email ||
    !data.sex ||
    !data.tsize
  ) {
    
    alert("Please fill in your details.");
    return;
    
  }
  
  db.collection("marathon").doc(data.email).set(data)
    
    .then(() => {
      alert("Applied for registration");
    })
    
    .catch((error) => {
      alert(error.message);
    });
  
}

function add() {
  
  var lor = document.getElementById("lor");
  
  var runner = document.createElement("span");
  
  runner.innerHTML = `
    <label>Runner's Name</label>

    <input
        type="text"
        placeholder="Runner's Name"
        class="canditate-name"
        required
    >

    <label>Runner's T-shirt Size</label>

    <select class="tshirt" required>
        <option value="">Runner's T-shirt size</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
        <option value="XXL">XXL</option>
    </select>

    <label>Runner's Gender</label>

    <select class="gender" required>
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
    </select>
`;
  
  lor.insertBefore(runner, document.getElementById("ad"));
  
}

function registerGroup() {
  
  var details = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    sex: "",
    tsize: [],
    status: "approved",
    type: "group",
    gender: [],
    lor: [],
    address: document.getElementById("address").value.trim()
  };
  
  document.querySelectorAll(".canditate-name").forEach((name) => {
    details.lor.push(name.value.trim());
  });
  
  document.querySelectorAll(".tshirt").forEach((size) => {
    details.tsize.push(size.value);
  });
  
  document.querySelectorAll(".gender").forEach((gender) => {
    details.gender.push(gender.value);
  });
  
  if (
    !details.name ||
    !details.phone ||
    !details.email ||
    details.lor.length === 0 ||
    details.lor.length !== details.tsize.length ||
    details.lor.length !== details.gender.length ||
    details.lor.some(name => !name) ||
    details.tsize.some(size => !size) ||
    details.gender.some(gender => !gender)
  ) {
    
    alert("Please fill all runner details.");
    return;
    
  }
  
  db.collection("marathon").doc(details.email).set(details)
    
    .then(() => {
      alert("Applied for group registration");
    })
    
    .catch((error) => {
      alert(error.message);
    });
  
}