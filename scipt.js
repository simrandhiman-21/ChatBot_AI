const API_KEY = "AIzaSyDSgFmTjqv665yMkX8gaQINWFO1RiP8R94"; // Store your keys securely
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const fileInput = document.querySelector('#file-input');
const fileuploadwrapper = document.querySelector('.file-upload-wrapper');
let userData = {}; // Initialize userData to store file data

const filecancelButton =document.querySelector("#file-cancel");

const generateBotResponse = async (userText, imageData) => {
    if (!userText && !imageData) {
        return "Error: Empty message received.";
    }

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: userText,
                    },
                    ...(userData.file ? [{ inline_data: userData.file }] : []), // Include the file data if it exists
                ]
            }
        ]
    };
    console.log("Request Body:", JSON.stringify(requestBody)); // Log the request body

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        if (!response.ok) {
            const errorData = await response.json(); // Get the error response
            console.error("Error response from API:", errorData);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error.message}`);
        }
        const responseData = await response.json();
        console.log("API Response:", responseData);
        return responseData.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '').trim() || "No response from bot";
    } catch (error) {
        console.error("Error fetching bot response:", error);
        return "Error: Could not fetch response.";
    } finally {
        // Reset userData.file to clear the selected file
        userData.file = {};
    }
};


// Update the event listener for sending messages
document.getElementById('send-msg').addEventListener('click', function (e) {
    e.preventDefault();
    const input = document.querySelector('.msg-input');
    const rawMessage = input.value.trim();  // Trim input message

    if (rawMessage.length > 0 || userData.file) {
        // Create user message element
        const userMessage = document.createElement('div');
        userMessage.className = 'msg user-msg';
        const messageText = document.createElement('div');
        messageText.className = 'msg-txt';
        messageText.textContent = rawMessage;

        userMessage.appendChild(messageText);
        
        // Check if there's an uploaded file and add it to the message
        if (userData.file) {
            const imgElement = document.createElement('img');
            imgElement.src = `data:${userData.file.mime_type};base64,${userData.file.data}`;
            imgElement.className = 'attachment';
            userMessage.appendChild(imgElement);
        }

        document.querySelector('.ccontent').appendChild(userMessage);
        
        // Clear input field
        input.value = '';


        filecancelButton.addEventListener("click",()=>{
            userData.file = {};
            fileuploadwrapper.classList.remove("file-uploaded");
        })

        // Add a thinking indicator for the bot
        setTimeout(async () => {
            const botMessage = document.createElement('div');
            botMessage.className = 'msg bot-msg thinking';
            botMessage.innerHTML = ` 
            <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 2.5 1.03 4.76 2.68 6.36-.03.1-.07.2-.07.31 0 .55.45 1 1 1h2.5c.55 0 1-.45 1-1v-1.5c0-.55-.45-1-1-1H6.68C6.03 16.76 6 15.9 6 15c0-4.41 3.59-8 8-8s8 3.59 8 8c0 .9-.03 1.76-.68 2. 36h-1.82c-.55 0-1 .45-1 1v1.5c0 .55.45 1 1 1h2.5c.55 0 1-.45 1-1 0-.11-.04-.21-.07-.31C21.97 16.76 23 14.5 23 12c0-5.52-4.48-10-10-10z"/>
            </svg>
                <div class="msg-txt">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>
            `;
            
            document.querySelector('.ccontent').appendChild(botMessage);
            document.querySelector('.ccontent').scrollTo({ top: document.querySelector('.ccontent').scrollHeight, behavior: "smooth" });
            
            // Now call generateBotResponse to get the bot's real response
            const botResponseText = await generateBotResponse(rawMessage, userData.file ? userData.file.data : null);
            botMessage.classList.remove('thinking'); // Remove thinking class
            botMessage.innerHTML = `
            <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 2.5 1.03 4.76 2.68 6.36-.03.1-.07.2-.07.31 0 .55.45 1 1 1h2.5c.55 0 1-.45 1-1v-1.5c0-.55-.45-1-1-1H6.68C6.03 16.76 6 15.9 6 15c0-4.41 3.59-8 8-8s8 3.59 8 8c0 .9-.03 1.76-.68 2.36h-1.82c-.55 0-1 .45-1 1v1.5c0 .55.45 1 1 1h2.5c.55 0 1-.45 1-1 0-.11-.04-.21-.07-.31C21.97 16.76 23 14.5 23 12c0-5.52-4.48-10-10-10z"/>
            </svg>
                <div class="msg-txt">${botResponseText}</div>
            `;
            document.querySelector('.ccontent').scrollTo({ top: document.querySelector('.ccontent').scrollHeight, behavior: "smooth" });
        }, 1000);
    }
});

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    // Convert file to base64 format
    const reader = new FileReader();
    reader.onload = (e) => {
        fileuploadwrapper.querySelector("img").src=e.target.result;
        fileuploadwrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];
        console.log("File data:", base64String); // Log the base64 string
        userData.file = {
            data: base64String,
            mime_type: file.type
        };
        fileInput.value = ""; // Clear the file input
    };
    reader.readAsDataURL(file);
});

document.querySelector('#file-upload').addEventListener("click", () => fileInput.click());