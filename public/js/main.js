const chatForm = document.getElementById('chat-form');
const ChatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get Username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

// Join chatroom
socket.emit('JoinRoom', { username, room })

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

// Message from server
socket.on('message', message => {
    console.log(message);
    OutputMessage(message);

    // Scroll down
    ChatMessages.scrollTop = ChatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg)

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function OutputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room anme to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`;
}