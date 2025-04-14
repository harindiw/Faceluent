// Listener for when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log("FaceFluent extension installed and ready!");
});

// Listen for messages from popup.js or other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "testBackground") {
        console.log("Message received in background script:", message);
    sendResponse({ status: "Success from background.js" });
}

    if (message.action === "start_detection") {
        console.log("Starting facial detection...");

        // Send a message to content.js to start webcam detection
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "start_camera" });
            }
        });
    }
});
