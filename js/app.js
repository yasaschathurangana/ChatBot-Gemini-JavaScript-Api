const api_key = GEMINI_API_KEY.API_KEY;
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendbtn = document.getElementById("send-btn");

function addMessage(message, className) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", className);
    msgDiv.textContent = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message");
    typingDiv.textContent = "Gemini is typing...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return typingDiv;
}

window.onload = () => {
    const savedChat = localStorage.getItem("chatHistory");
    console.log({ savedChat });
    if (savedChat) chatBox.innerHTML = savedChat;
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getBotReply(userMessage) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${api_key}`

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: userMessage }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("API Error:", data);
            return data?.error?.message || "Error Fetching response."
        }

        return (
            data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry I couldnt get that."
        )
    } catch (error) {

    }
}

sendbtn.addEventListener("click", async () => {
    const message = userInput.value.trim();
    if (message === "") return;
    addMessage(message, "user-message");
    userInput.value = "";

    const typingDiv = showTyping();

    const botReply = await getBotReply(message);
    typingDiv.remove();
    addMessage(botReply, "bot-message");

    localStorage.setItem("chatHistory", chatBox.innerHTML);
})

userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendbtn.click();
})