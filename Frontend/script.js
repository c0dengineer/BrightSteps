// const BASE_URL = "http://localhost:8000";
const BASE_URL = "https://maranda-multivoiced-vern.ngrok-free.dev";

if (
    window.location.pathname.includes("dashboard.html") ||
    window.location.pathname.includes("childinfo.html") ||
    window.location.pathname.includes("test.html") ||
    window.location.pathname.includes("report.html")
) {
    if (!localStorage.getItem("token")) {
        window.location.href = "login.html";
    }
}



function goToTest() {
    window.location.href = "login.html";
}

function scrollToWhy() {
    document.getElementById("why").scrollIntoView({behavior: "smooth"});
}

// SIGNIN
async function loginUser() {

    let email = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let errorMsg = document.getElementById("errorMsg");

    errorMsg.innerText = "";

    if (!email) {
        errorMsg.innerText = "Please enter your email.";
        return;
    }

    if (!password) {
        errorMsg.innerText = "Please enter password.";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                username: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {

            // Save token instead of loggedIn
            localStorage.setItem("token", data.access_token);

            window.location.href = "dashboard.html";

        } else {
            errorMsg.innerText = "Invalid email or password.";
        }

    } catch (error) {
        errorMsg.innerText = "Server error. Please try again.";
    }
}

// SIGNUP
async function signupUser() {
    let name = document.getElementById("signupName").value.trim();
    let email = document.getElementById("signupEmail").value.trim();
    let password = document.getElementById("signupPassword").value.trim();
    let msg = document.getElementById("signupMsg");

    msg.style.color = "red";
    msg.innerText = "";

    if (!name) {
        msg.innerText = "Please enter your name.";
        return;
    }

    if (!email) {
        msg.innerText = "Please enter your email.";
        return;
    }

    if (!password) {
        msg.innerText = "Please create a password.";
        return;
    }

    if (password.length < 6) {
        msg.innerText = "Password must be at least 6 characters.";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            msg.style.color = "green";
            msg.innerText = "Account created successfully!";
            
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } else {
            msg.innerText = data.detail || "Signup failed.";
        }

    } catch (error) {
        msg.innerText = "Server error. Please try again.";
    }
}

// GUEST
// function continueGuest() {
//     localStorage.setItem("username", "Guest");
//     localStorage.setItem("loggedIn", "true");
//     window.location.href = "disclaimer.html";
// }


//FORGOT PASSWORD
// function resetPasswordPage() {

//     let email = document.getElementById("resetEmail").value.trim();
//     let newPass = document.getElementById("newPassword").value.trim();
//     let confirmPass = document.getElementById("confirmPassword").value.trim();
//     let msg = document.getElementById("resetMsg");

//     msg.style.color = "red";
//     msg.innerText = "";

//     if (!email) {
//         msg.innerText = "Please enter your email.";
//         return;
//     }

//     if (!newPass) {
//         msg.innerText = "Please enter new password.";
//         return;
//     }

//     if (newPass.length < 6) {
//         msg.innerText = "Password must be at least 6 characters.";
//         return;
//     }

//     if (newPass !== confirmPass) {
//         msg.innerText = "Passwords do not match.";
//         return;
//     }

//     let users = JSON.parse(localStorage.getItem("users")) || {};

//     if (!users[email]) {
//         msg.innerText = "Account not found.";
//         return;
//     }

    // Update password
    users[email].password = newPass;
    localStorage.setItem("users", JSON.stringify(users));

    msg.style.color = "green";
    msg.innerText = "Password updated successfully! Redirecting...";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);

// LOGOUT
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// NAVBAR GREETING
document.addEventListener("DOMContentLoaded", function () {

    const userArea = document.getElementById("userArea");
    if (!userArea) return;

    const token = localStorage.getItem("token");

    if (token) {
        userArea.innerHTML = `
            <button class="btn btn-sm btn-outline-danger ms-2" onclick="logout()">Logout</button>
        `;
    }
});

// CHILD INFO
async function goNextStep() {

    let name = document.getElementById("childName").value.trim();
    let dob = document.getElementById("childDOB").value.trim();
    let genderElement = document.querySelector('input[name="gender"]:checked');
    let gender = genderElement ? genderElement.value : "";

    if (!name || !dob || !gender) {
        alert("Please fill all required fields.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/children`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                dob: dob,
                gender: gender
            })
        });

        if (response.ok) {
            window.location.href = "disclaimer.html";
        } else {
            alert("Failed to save child.");
        }

    } catch (error) {
        alert("Server error.");
    }
}

// TEST
function startScreening() {
    window.location.href = "test.html";
}

// SUBMIT TEST
async function submitTest(score) {

    try {
        const response = await fetch(`${BASE_URL}/test/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                score: score
            })
        });

        if (response.ok) {
            window.location.href = "report.html";
        } else {
            alert("Failed to submit test.");
        }

    } catch (error) {
        alert("Server error.");
    }
}



// REPORT
// window.onload = function() {
//     if (window.location.pathname.includes("report.html")) {
//         let score = localStorage.getItem("testScore");

//         if (score === null) {
//             document.getElementById("reportArea").innerHTML = 
//                 "<p>Please complete the screening first.</p>";
//         } else {
//             document.getElementById("reportArea").innerHTML =
//                 `<p>Your score: ${score}</p>
//                  <p>This is a basic screening insight. Please consult a specialist for evaluation.</p>`;
//         }
//     }
// }

function goBackStep1() {
    window.location.href = "childinfo.html";
}


