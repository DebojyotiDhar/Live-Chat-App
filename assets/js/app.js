// Import Firebase
import {initializeApp} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getDatabase, ref, push, onChildAdded} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBhucE0hPMRsiL_Pz3Eq7lWf0vfL8VdPQg",
    authDomain: "live-chat-app-be83a.firebaseapp.com",
    projectId: "live-chat-app-be83a",
    storageBucket: "live-chat-app-be83a.firebasestorage.app",
    messagingSenderId: "931756051081",
    appId: "1:931756051081:web:0e70596f58637fbeeed458",
    measurementId: "G-XVWVQT29D8"
};

// Initialise Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const chatBox = document.querySelector(".messages");
const userInput = document.getElementById('username');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById("send-btn");

// Firebase DB Reference
const messageRef = ref(db, "liveChat");

// Send Message
sendBtn.addEventListener("click", sendMessage);
// Handle "Enter" and "Shift + Enter" key events
messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    } else if (event.key === "Enter" && event.shiftKey) {
        event.preventDefault();
        const cursorPosition = messageInput.selectionStart;
        const text = messageInput.value;
        messageInput.value = text.slice(0, cursorPosition) + "\n" + text.slice(cursorPosition);
        messageInput.selectionStart = messageInput.selectionEnd = cursorPosition + 1;
    }
});


function sendMessage(){
    const username = userInput.value.trim();
    const message = messageInput.value.trim();

    if(username && message){
        const timestamp = new Date().toISOString();
        push(messageRef, {
            username,
            message,
            timestamp,
        })
        .then(() => {
            console.log("Message sent successfully");
        })
        .catch((error) => {
            console.error("Error: ", error);
        });

        messageInput.value = '';
    }else{
        console.error("Username or message is empty");
    }
}

// Listen for new message
onChildAdded(messageRef, (data) => {
    const {username, message, timestamp } = data.val();
    displayMessage(username, message, timestamp);
});

// Display message function
function displayMessage(username, message, timestamp){
    const messageDiv = document.createElement('div');
    messageDiv.classList.add("message");

    const span1 = document.createElement("span");
    const profileImg = document.createElement("img");
    profileImg.src = "assets/images/user.png";
    profileImg.classList.add("profileImg");

    span1.appendChild(profileImg);

    const userName = document.createElement("p");
    userName.classList.add("UserName");
    userName.textContent = `${username}`;
    span1.appendChild(userName);

    const span2 = document.createElement("span");
    span2.textContent = message;

    const span3 = document.createElement("span");
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
    });

    span3.textContent = formattedTime;

    messageDiv.appendChild(span1);
    messageDiv.appendChild(span2);
    messageDiv.appendChild(span3);

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}