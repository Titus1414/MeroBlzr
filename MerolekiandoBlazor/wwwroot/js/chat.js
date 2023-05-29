"use strict";
let inputValue = '';
const serverlink = 'https://localhost:7065/';
const prodPage = localStorage.getItem('productPage');
const sellerId = localStorage.getItem('sellerId');
const pid = localStorage.getItem('clickedProduct');
const userId = localStorage.getItem('userId');
const input = document.getElementById('txtMessage');
function onChange() {
    input.value = inputValue;
}
const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${serverlink}chat`)
    .configureLogging(signalR.LogLevel.Information)
    .build();

const start = async () => {
    try {
        await connection.start();
        console.log("Connected to signal r hub");
        //document.getElementById('txtOutput').innerHTML = "";
    } catch (error) {
        console.log(error);
    }
}


connection.on("ReceiveMessage", (message, senderId, UserId, time, json) => {
    console.log("this is msg from recieve funcion :", message, senderId, UserId, time, json);
    const messageClass = "received";
    appendMessage(message, messageClass);
    const alertSound = new Audio('chat-sound.mp3');
    alertSound.play();
});

const appendMessage = (message, messageClass) => {
    console.log("this is message class", messageClass);
    const messageSectionEl = document.getElementById('txtOutput');
    const msgBoxEl = document.createElement("div");
    msgBoxEl.classList.add("d-flex", "flex-row");
    if (messageClass == 'send') {
        console.log("if condition works");
        msgBoxEl.classList.add("justify-content-start");
        msgBoxEl.setAttribute('id', 'sender');
        msgBoxEl.classList.add(messageClass);
        msgBoxEl.innerHTML = `<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"
    alt="avatar 1" style="width: 45px; height: 100%;">
<div style="max-width: 235px;">
    <p class="small p-2 ms-3 mb-1 rounded-3 p2-bg">${message}</p></div>`;
        //         messageSectionEl.innerHTML += `<div class="d-flex flex-row justify-content-start" id="sender"></div>`;
    }
    else {
        msgBoxEl.classList.add("justify-content-end", "my-4", "pt-1");
        msgBoxEl.setAttribute('id', 'receiver');
        msgBoxEl.classList.add(messageClass);
        msgBoxEl.innerHTML = `<div style="max-width: 235px;">
    <p class="small p-2 me-3 mb-1  rounded-3 chat-default-bg">${message}</p></div>
<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
    alt="avatar 1" style="width: 45px; height: 100%;">`;
        // messageSectionEl.innerHTML += `<div class="d-flex flex-row justify-content-end my-4 pt-1" id="gpt"></div> `;
    }


    messageSectionEl.appendChild(msgBoxEl);
}

// binding the event for send button
//document.getElementById('btnSend').addEventListener('click', async (e) => {
async function sendmsg(e) { 
    //debugger
    console.log('clicked');
    e.preventDefault();
    //const user = getUser();
    const user = 'bob';
    //if (!user)
    //    return;
    const txtMessageEl = document.getElementById('txtMessage');
    const msg = txtMessageEl.value;
    if (msg) {
        const msgClass = "send";
        // call the sendmessage api
        console.log(msg, sellerId, pid, userId);
        await sendMessage(`${user}: ${msg}`, sellerId, pid, userId);  // john: hey guys
        txtMessageEl.value = "";
        appendMessage(msg, msgClass);
        //receiveMessage();
    }
}
const sendMessage = async (message, sellerId, pid, userId) => {

    try {
        await connection.invoke('SendMessage', message, sellerId, pid, userId);
    } catch (error) {
        console.log(error);
    }
}
const startApp = async () => {
    await start(); // connection will stablised
    //await joinUser();
}
function openForm() {
    document.getElementById("chatbox").style.display = "block";
    //document.getElementById("open-button").style.display = "none";
    startApp();
}

function closeForm() {
    document.getElementById("chatbox").style.display = "none";
    //document.getElementById("open-button").style.display = "block";

}

