document.addEventListener("DOMContentLoaded", function() {
    var profileName = document.getElementById("profileName")
    profileName.innerHTML = name
    var profileEmail = document.getElementById("profileEmail")
    profileEmail.innerHTML = localStorage.getItem("FutsalEmail")
});

function logout(param) {
    auth.signOut()
    localStorage.removeItem("FutsalLogin")
    localStorage.removeItem("FutsalEmail")
    window.location.replace("/")
}

