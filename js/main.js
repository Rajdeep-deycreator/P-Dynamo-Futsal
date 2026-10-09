/* =========================================================
   P Dynamo - main.js
   1. Hide broken images (so placeholders show until you add yours)
   2. Image marquee (duplicates images for a seamless loop)
   3. Time slot checker
   4. Signup form validation
   ========================================================= */

/* ---------- 1. Broken image fallback ---------- */
document.querySelectorAll('img').forEach((img) => {
    const hide = () => { img.style.visibility = 'hidden'; };
    img.addEventListener('error', hide);
    if (img.complete && img.naturalWidth === 0) hide();
});

/* ---------- 2. Marquee ---------- */
const marqueeTrack = document.querySelector('.marquee-track');

if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}

/* ---------- 3. Slot checker ---------- */
const slotGrid = document.getElementById('slot-grid');

if (slotGrid) {
    const dateInput = document.getElementById('slot-date');
    const summary = document.getElementById('slot-summary');
    const bookButton = document.getElementById('slot-book-btn');

    const OPEN_HOUR = 6;    // first slot starts at 6 AM
    const CLOSE_HOUR = 24;  // last slot ends at 12 AM
    let selectedHour = null;

    // TODO (backend): replace with fetch(`/api/slots?date=${date}`) that returns booked hours
    function getBookedHours(date) {
        return [7, 18, 20, 21];
    }

    function formatHour(hour) {
        const suffix = hour >= 12 && hour < 24 ? 'PM' : 'AM';
        const hour12 = hour % 12 === 0 ? 12 : hour % 12;
        return `${hour12}:00 ${suffix}`;
    }

    function selectSlot(button, hour) {
        slotGrid.querySelectorAll('.slot').forEach((s) => s.classList.remove('selected'));
        button.classList.add('selected');
        selectedHour = hour;
        summary.textContent = `Selected: ${formatHour(hour)} - ${formatHour(hour + 1)}`;
        bookButton.disabled = false;
    }

    function renderSlots() {
        const booked = getBookedHours(dateInput.value);
        const now = new Date();
        const isToday = dateInput.value === now.toLocaleDateString('en-CA');

        selectedHour = null;
        summary.textContent = 'No slot selected';
        bookButton.disabled = true;
        slotGrid.innerHTML = '';

        for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
            const slot = document.createElement('button');
            slot.className = 'slot';
            slot.textContent = `${formatHour(hour)} - ${formatHour(hour + 1)}`;

            const isPast = isToday && hour <= now.getHours();

            if (booked.includes(hour) || isPast) {
                slot.disabled = true;
            } else {
                slot.addEventListener('click', () => selectSlot(slot, hour));
            }
            slotGrid.appendChild(slot);
        }
    }

    bookButton.addEventListener('click', () => {
        // TODO (backend): send { date: dateInput.value, hour: selectedHour } to your booking API
        alert(`Booking request: ${dateInput.value}, ${formatHour(selectedHour)}`);
    });

    const today = new Date().toLocaleDateString('en-CA');
    dateInput.min = today;
    dateInput.value = today;
    dateInput.addEventListener('change', renderSlots);
    renderSlots();
}

/* ---------- 4. Signup validation ---------- */
const signupForm = document.getElementById('signup-form');

if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
        if (signupForm.password.value !== signupForm.confirm.value) {
            event.preventDefault();
            document.getElementById('form-error').textContent = 'Passwords do not match.';
        }
    });
}


var email
var loginStatus
var name
var ph
var email

  
  function check(){
    email= localStorage.getItem("FutsalEmail")
    loginStatus= localStorage.getItem("FutsalLogin")
    if (email && loginStatus){
      var nav=document.getElementById("nav-actions")
      retrive(email)
      nav.innerHTML=""
    }
  }
  
  function retrive(email){
    db.collection("Users").doc(email).get().then((snap)=>{
      if (snap.exists){
        var userData=snap.data()
        name=userData.Name
        console.log(name)
        var nav=document.getElementById("nav-actions")
        nav.innerHTML="<a href='/accounting /profile/profile.html' class='btn btn-lime'>"+name+"</a>"
      }else{
        console.log("no data")
      }
    }).catch((error)=>{
      console.log(error.message)
    })
  }
  
  document.addEventListener("DOMContentLoaded",check)