function adminLogin(){
    var email = document.getElementById("adminEmail").value.trim();
    var pass = document.getElementById("adminPassword").value;
    var err = document.getElementById("errorMsg");

    if(!email || !pass){
        err.innerText = "Email & Password required";
        return;
    }
    err.innerText = "Checking...";

    auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
        return db.collection("admin").doc(email).get();
    })
    .then((doc) => {
        if(doc.exists && doc.data().role === "admin"){
            localStorage.setItem("futsalAdminEmail", email);
            localStorage.setItem("isFutsalAdmin", "true");
            localStorage.setItem("loginStatus", "true");
            window.location.replace("/admin/dashboard /index.html");
        } else {
            firebase.auth().signOut();
            err.innerText = "Access Denied! Not a Futsal Admin.";
        }
    })
    .catch((e) => {
        err.innerText = e.message;
    });
}

(function(){
    if(localStorage.getItem("isFutsalAdmin") === "true"){
        window.location.replace("/admin/dashboard /index.html");
    }
})();