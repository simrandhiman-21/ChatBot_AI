const API_KEY = "AIzaSyDSgFmTjqv665yMkX8gaQINWFO1RiP8R94"; // Store your keys securely
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const generateBotResponse = async (userText) => {
    if (!userText) {
        return "Error: Empty message received.";
    }

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userText }] }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const responseData = await response.json();
    return responseData.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g).trim() || "No response from bot";
    } catch (error) {
        console.error("Error fetching bot response:", error);
        return "Error: Could not fetch response.";
    }
};

document.getElementById('send-msg').addEventListener('click', function (e) {
    e.preventDefault();
    const input = document.querySelector('.msg-input');
    const rawMessage = input.value.trim();  // Trim input message

    if (rawMessage.length > 0) {
        // Create user message element
        const userMessage = document.createElement('div');
        userMessage.className = 'msg user-msg';
        const messageText = document.createElement('div');
        messageText.className = 'msg-txt';
        messageText.textContent = rawMessage;

        userMessage.appendChild(messageText);
        document.querySelector('.ccontent').appendChild(userMessage);
        
        // Clear input field
        input.value = '';

        // Add a thinking indicator for the bot
        setTimeout(async () => {
            const botMessage = document.createElement('div');
            botMessage.className = 'msg bot-msg thinking';
            botMessage.innerHTML = ` 
                <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35 .1 35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
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
            const botResponseText = await generateBotResponse(rawMessage);
            botMessage.classList.remove('thinking'); // Remove thinking class
            botMessage.innerHTML = `
                <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>
                <div class="msg-txt">${botResponseText}</div>
            `;
            document.querySelector('.ccontent').scrollTo({ top: document.querySelector('.c content').scrollHeight, behavior: "smooth" });
        }, 1000);
    }
});