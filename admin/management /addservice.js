
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

  if (localStorage.getItem("FutsalLogin") === "true" ||
      localStorage.getItem("loginStatus") === "true") {
    loginstatus = true;

    var nameInput = document.getElementById("name");
    var phoneInput = document.getElementById("phone");
    var emailInput = document.getElementById("email");

  
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
    alert("Booking successful!");

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
