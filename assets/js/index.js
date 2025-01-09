// Function to set cookie
function setCookie(name, value, days){
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()};path=/`;
}

// Start Btn 
document.getElementById('startChat').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();

    if(username){
        setCookie('username', username, 7); // Set cookie for 7 days
        window.location.href = './livechat.html';
    }else{
        alert('Please enter a username');
    }
});