
// 2. Load all users
function loadAllUsers(){
    var tbody = document.getElementById("usersTableBody");
    db.collection("Users").get().then(snapshot => {
        if(snapshot.empty){
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#666;">No users found</td></tr>`;
            return;
        }
        
        let html = "";
        let i = 1;
        snapshot.forEach(doc => {
            let d = doc.data();
            let name = d.name || d.Name || "N/A";
            let email = d.email || doc.id;
            
            let membership = d.membership;///

            html += `
            <tr>
                <td>${i++}</td>
                <td>${name}</td>
                <td>${email}</td>
                <td>${membership}</td>
            </tr>`;
        });
        tbody.innerHTML = html;
    }).catch(err => {
        tbody.innerHTML = `<tr><td colspan="5" style="color:#ff4d4d;">${err.message}</td></tr>`;
    });
}



loadAllUsers()
