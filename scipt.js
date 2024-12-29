const API_KEY = "AIzaSyDSgFmTjqv665yMkX8gaQINWFO1RiP8R94"; // Store your keys securely
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const fileInput = document.querySelector('#file-input');
const fileuploadwrapper = document.querySelector('.file-upload-wrapper');
const filecancelButton = document.querySelector("#file-cancel");
const sendButton = document.querySelector('#send-msg');
const chatContent = document.querySelector('.ccontent');
const messageInput = document.querySelector('.msg-input');

let userData = {};
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

// Function to handle the bot response generation
const generateBotResponse = async (userText, imageData) => {
    chatHistory.push({
        role: "user",
        parts: [
            { text: userText },
            ...(userData.file ? [{ inline_data: userData.file }] : []),
        ]
    });

    const requestBody = {
        contents: chatHistory
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });
        const responseData = await response.json();
        return responseData.candidates[0]?.content.parts[0]?.text || "No response";
    } catch (error) {
        console.error("Error:", error);
        return "Error fetching response.";
    } finally {
        userData.file = {}; // Reset file data after sending
    }
};

// Attach Event Listeners
sendButton.addEventListener('click', async (e) => {
    e.preventDefault();
    messageInput.dispatchEvent(new Event("input"));
    const rawMessage = messageInput.value.trim();
    if (!rawMessage && !userData.file) return; // Prevent sending empty message

    // Add user message to the chat
    const userMessage = document.createElement('div');
    userMessage.className = 'msg user-msg';
    userMessage.innerHTML = `<div class="msg-txt">${rawMessage}</div>`;
    if (userData.file) {
        const imgElement = document.createElement('img');
        imgElement.src = `data:${userData.file.mime_type};base64,${userData.file.data}`;
        imgElement.className = 'attachment';
        userMessage.appendChild(imgElement);
    }
    chatContent.appendChild(userMessage);
    messageInput.value = '';

    // Add bot's thinking animation
    const botMessage = document.createElement('div');
    botMessage.className = 'msg bot-msg thinking';
    botMessage.innerHTML = `
        <div class="msg-txt">
            <div class="thinking-indicator">
                <div class="dot"></div><div class="dot"></div><div class="dot"></div>
            </div>
        </div>`;
    chatContent.appendChild(botMessage);
    chatContent.scrollTo({ top: chatContent.scrollHeight, behavior: "smooth" });

    // Get bot response and update chat
    const botResponseText = await generateBotResponse(rawMessage, userData.file?.data || null);
    botMessage.classList.remove('thinking');
    botMessage.innerHTML = `<div class="msg-txt">${botResponseText}</div>`;
    chatContent.scrollTo({ top: chatContent.scrollHeight, behavior: "smooth" });
});

// Adjust input field dynamically
messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`; // Reset height before resizing
    messageInput.style.height = `${messageInput.scrollHeight}px`; // Adjust to new content
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

// Other Listeners for file upload
filecancelButton.addEventListener("click", () => {
    userData.file = {}; // Clear file data
    fileuploadwrapper.classList.remove("file-uploaded"); // Reset UI
});

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target.result.split(",")[1];
            userData.file = { data: base64String, mime_type: file.type };

            // Display the file preview
            const imgElement = fileuploadwrapper.querySelector("img");
            imgElement.src = e.target.result;
            fileuploadwrapper.classList.add("file-uploaded");
            fileInput.value = ""; // Reset the file input field
        };
        reader.readAsDataURL(file);
    }
});

// Toggle chatbot visibility
chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
});

// Close chatbot
closeChatbot.addEventListener("click", () => {
    document.body.classList.remove("show-chatbot");
});
