var filter = document.getElementById("filter").value;
var groupData = document.getElementById("groupData");

/* Filter Change */

document.getElementById("filter").addEventListener("change", () => {

filter = document.getElementById("filter").value;

retriveGroup(filter);

});

/* Page Load */

document.addEventListener("DOMContentLoaded", () => {

retriveGroup(filter);

});

/* Approve Application */

function approve(id) {

db.collection("marathon").doc(id).update({
    status: "approved"
})

.then(() => {
    alert("Approved");
})

.catch((error) => {
    console.log(error.message);
});

}

/* Retrieve Group Applications */

function retriveGroup(filter) {

groupData.innerHTML = "";

var query = db.collection("marathon")
    .where("type", "==", "group");

if (filter !== "all") {

    query = query.where("status", "==", filter);

}

query.onSnapshot((info) => {

    groupData.innerHTML = "";

    var number = 0;

    info.forEach((information) => {

        number++;

        var details = information.data();

        var runners = "";

        /* Runner Details */

        for (var i = 0; i < details.lor.length; i++) {

            runners += `
                <div class="runner-details">

                    <h4>Runner ${i + 1}</h4>

                    <p>
                        <b>Name:</b>
                        ${details.lor[i]}
                    </p>

                    <p>
                        <b>T-Shirt Size:</b>
                        ${details.tsize[i]}
                    </p>

                    <p>
                        <b>Gender:</b>
                        ${details.gender[i]}
                    </p>

                </div>
            `;

        }


        /* Group Application Card */

        groupData.innerHTML += `

            <div class="group-card">

                <h3>Group Application #${number}</h3>

                <p>
                    <b>Group Name:</b>
                    ${details.name}
                </p>

                <p>
                    <b>Phone:</b>

                    <a href="tel:${details.phone}">
                        ${details.phone}
                    </a>
                </p>

                <p>
                    <b>Email:</b>
                    ${details.email}
                </p>

                <p>
                    <b>Address:</b>
                    ${details.address}
                </p>

                <p>
                    <b>Total Runners:</b>
                    ${details.lor.length}
                </p>

                <p>
                    <b>Status:</b>
                    ${details.status}
                </p>


                <h3>Runner Information</h3>

                ${runners}


                <input
                    type="button"
                    value="Approve"
                    onclick="approve('${details.email}')"
                    ${details.status === "approved" ? "disabled" : ""}
                />

            </div>

        `;

    });

});

}