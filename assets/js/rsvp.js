const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

async function fetchGuestDetails() {
    const inviteCode = document.getElementById("inviteCode").value.trim();

    if (!inviteCode) {
        alert("Please enter your invite code.");
        return;
    }

    // Fetch guest details from Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/guests?invite_code=eq.${inviteCode}`, {
        headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
        }
    });

    const guestData = await response.json();

    if (guestData.length === 0) {
        alert("Invite code not found. Please check your code.");
        return;
    }

    // Show RSVP form with guest's name
    const guest = guestData[0];
    document.getElementById("guestName").textContent = `Welcome, ${guest.name}!`;
    document.getElementById("rsvpForm").style.display = "block";

    // Auto-fill any existing details (if re-submitting)
    document.getElementById("guestEmail").value = guest.email || "";
    document.getElementById("guestPhone").value = guest.phone || "";

    // Show event options dynamically based on guest profile (e.g., if they are invited to hen/stag do)
    document.getElementById("eventOptions").style.display = "block";
}

async function submitRSVP() {
    const inviteCode = document.getElementById("inviteCode").value.trim();
    const email = document.getElementById("guestEmail").value.trim();
    const phone = document.getElementById("guestPhone").value.trim();
    const attending = document.querySelector('input[name="attending"]:checked')?.value;
    const mealChoice = document.getElementById("mealChoice").value;
    const specialRequests = document.getElementById("specialRequests").value;

    if (!email || !phone) {
        alert("Please enter your email and phone number.");
        return;
    }

    if (!attending) {
        alert("Please select if you are attending.");
        return;
    }

    // Collect event attendance
    const ceremony = document.getElementById("ceremony").checked;
    const henDo = document.getElementById("henDo").checked;
    const stagDo = document.getElementById("stagDo").checked;
    const receptionDinner = document.getElementById("receptionDinner").checked;

    // Update RSVP details in Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/guests?invite_code=eq.${inviteCode}`, {
        method: "PATCH",
        headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            phone: phone,
            attending: attending === "true",
            ceremony: ceremony,
            hen_do: henDo,
            stag_do: stagDo,
            reception_dinner: receptionDinner,
            meal_choice: mealChoice,
            special_requests: specialRequests,
        })
    });

    if (response.ok) {
        alert("RSVP submitted successfully!");
        window.location.href = "thank-you.html";  // Redirect to Thank You page
    } else {
        alert("Error submitting RSVP. Please try again.");
    }
}

// document.getElementById("rsvp-form").addEventListener("submit", async function (event) {
//     event.preventDefault();

//     const formData = {
//         name: document.getElementById("name").value,
//         phone: document.getElementById("phone").value,
//         email: document.getElementById("email").value,
//         attending_ceremony: document.getElementById("ceremony").checked,
//         attending_reception: document.getElementById("reception").checked
//     };

//     try {
//         const response = await fetch("http://localhost:5000/rsvp", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(formData)
//         });

//         const data = await response.json();
//         alert(data.message);  // Show success message
//     } catch (error) {
//         console.error("Error submitting RSVP:", error);
//     }
// });

const API_URL = "https://wedding-backend-kiny.onrender.com/rsvp"; // Replace with your backend URL

document.getElementById("rsvp-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        attending_ceremony: document.getElementById("ceremony").checked,
        attending_reception: document.getElementById("reception").checked
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Error submitting RSVP:", error);
    }
});
