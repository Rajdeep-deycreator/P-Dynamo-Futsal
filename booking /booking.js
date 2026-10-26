
var selectedTime = new Set();

var selectedDate;
var dateElement;
var loginstatus = false;
var day;
var serviceRate = 0;
var timeTotal = 0;


// INITIALIZE
document.addEventListener("DOMContentLoaded", function () {

  dateElement = document.getElementById("date");

  if (!dateElement) {
    console.error('Element id="date" not found');
    return;
  }

  if (localStorage.getItem("FutsalLogin") === "true") {
    loginstatus = true;

    var nameInput = document.getElementById("name");
    var phoneInput = document.getElementById("phone");
    var emailInput = document.getElementById("email");

    if (nameInput) {
      nameInput.value =
        localStorage.getItem("FutsalName") ||"";
    }

    if (phoneInput) {
      phoneInput.value = localStorage.getItem("FutsalPh") || "";
    }

    if (emailInput) {
      emailInput.value =
        localStorage.getItem("FutsalEmail") ||"";
    }
  }

  var today = new Date().toLocaleDateString("en-CA");

  selectedDate = today;
  dateElement.value = today;
  dateElement.min = today;

  dateElement.addEventListener("change", function () {
    selectedDate = dateElement.value;
    updateTimeSlot(selectedDate);
  });

  document.querySelectorAll(".slot").forEach(function (btn) {

    btn.addEventListener("click", function () {

      if (btn.disabled) return;

      var time = btn.innerText.trim();

      if (selectedTime.has(time)) {
        selectedTime.delete(time);
        btn.classList.remove("active");
      } else {
        selectedTime.add(time);
        btn.classList.add("active");
      }

      calculateTotal();
    });

  });

  updateTimeSlot(selectedDate);
});


// CALCULATE TOTAL
function calculateTotal() {

  timeTotal = selectedTime.size * serviceRate;

  var parent = document.getElementById("subtotal");

  if (!parent) return;

  parent.innerHTML = `
    <div id="timeCard">
      <h3>Selected Time Slots (${selectedTime.size})</h3>
      <p>${[...selectedTime].join(", ") || "No time selected"}</p>
      <p>Rate per slot: ₹${serviceRate}</p>
      <p>Time total: ₹${timeTotal}</p>
    </div>

    <div id="totaldiv">
      <h2>Final Total</h2>
      <span>₹${timeTotal}</span>
    </div>
  `;
}


// BOOKING
async function book() {

  var nameInput = document.getElementById("name");
  var phoneInput = document.getElementById("phone");
  var emailInput = document.getElementById("email");

  var data = {
    name: nameInput ? nameInput.value.trim() : "",
    phone: phoneInput ? phoneInput.value.trim() : "",
    email: emailInput ? emailInput.value.trim() : "",
    date: dateElement ? dateElement.value : "",
    time: [...selectedTime],
    rate: serviceRate,
    totalamount: "₹" + timeTotal,
    status: "active"
  };

  if (
    !data.name ||
    !data.phone ||
    !data.email ||
    !data.date ||
    data.time.length === 0
  ) {
    alert("Please fill in your details and select at least one time slot.");
    return;
  }

  try {

    var bookingCollection = db.collection("bookings")
      .doc("active")
      .collection(data.date);

    // Check all selected slots
    var checks = await Promise.all(
      data.time.map(function (time) {
        return bookingCollection.doc(time).get();
      })
    );

    if (checks.some(function (doc) {
      return doc.exists;
    })) {
      alert("One or more slots are already booked. Please select again.");
      await updateTimeSlot(data.date);
      return;
    }

    // One document per slot in bookings
    var bookingBatch = db.batch();

    data.time.forEach(function (time) {

      var bookingRef = bookingCollection.doc(time);

      bookingBatch.set(bookingRef, {
        name: data.name,
        phone: data.phone,
        email: data.email,
        date: data.date,
        time: time,
        rate: data.rate,
        totalamount: "₹" + data.rate,
        status: "active"
      });

    });

    await bookingBatch.commit();


    // One document per slot under the user's account
    if (loginstatus) {

      var userEmail =
        localStorage.getItem("FutsalEmail") ||
        localStorage.getItem("k2email") ||
        data.email;

      var userBookingCollection = db.collection("Users")
        .doc(userEmail)
        .collection("active_booking");

      var userBatch = db.batch();

      data.time.forEach(function (time) {

        var userBookingId =
          data.date + "\t" + time;

        var userBookingRef =
          userBookingCollection.doc(userBookingId);

        userBatch.set(userBookingRef, {
          name: data.name,
          phone: data.phone,
          email: data.email,
          date: data.date,
          time: time,
          rate: data.rate,
          totalamount: "₹" + data.rate,
          status: "active"
        });

      });

      await userBatch.commit();
    }


    // Send booking email
    try {

      var response = await fetch(
        "https://emailapifutsal.vercel.app/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: "pdynamofutsal@gmail.com",
            subject: "New Futsal Booking",
            message:
              "<h2>New Futsal Booking</h2>" +
              "<p>Name: " + data.name +
              "<br>Phone: " + data.phone +
              "<br>Email: " + data.email +
              "<br>Date: " + data.date +
              "<br>Selected slots: " + data.time.join(", ") +
              "<br>Rate per slot: ₹" + data.rate +
              "<br>Total slots: " + data.time.length +
              "<br>Total amount: ₹" + timeTotal +
              "</p>"
          })
        }
      );
      alert("Booking successful!");

      if (!response.ok) {
        console.error("Email failed:", response.status);
      }

    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    

    selectedTime.clear();

    await updateTimeSlot(data.date);

  } catch (error) {

    console.error("Booking error:", error);
    alert("Booking failed: " + error.message);
  }
}


// UPDATE AVAILABLE SLOTS
async function updateTimeSlot(date) {

  if (!date) return;

  day = new Date(date + "T12:00:00").getDay();

  serviceRate = rate(day);

  selectedTime.clear();

  document.querySelectorAll(".slot").forEach(function (btn) {
    btn.disabled = false;
    btn.classList.remove("active");
  });

  calculateTotal();

  try {

    var snapshot = await db.collection("bookings")
      .doc("active")
      .collection(date)
      .get();

    snapshot.forEach(function (doc) {

      var btn = document.getElementById(doc.id);

      if (btn) {
        btn.disabled = true;
        btn.classList.remove("active");
      }

    });

  } catch (error) {

    console.error("Loading slots failed:", error);
    alert("Unable to load available slots: " + error.message);
  }
}


// WEEKDAY / WEEKEND RATE
function rate(day) {

  if (day === 0 || day === 6) {
    return 2000;
  }

  return 1500;
}
