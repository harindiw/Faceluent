document.addEventListener("DOMContentLoaded", () => {
    const startCameraButton = document.getElementById("startCamera");
    const stopCameraButton = document.getElementById("stopCamera");
    const toggleButton = document.getElementById("toggleButton");
    const homePageButton = document.getElementById("homePageButton"); 
    const statusText = document.getElementById("status");
    const videoElement = document.getElementById("videoElement");
    const imagePreview = document.createElement("img");

    let isEnabled = false;
    let webcamStream = null;
    let capturedBlob = null;

    // Start Webcam
    startCameraButton.addEventListener("click", async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElement.srcObject = stream;
            webcamStream = stream;
            console.log("Webcam started successfully.");
        } catch (error) {
            console.error("Error accessing webcam:", error);
            alert("Error accessing webcam. Please allow permissions.");
        }
    });

    // Stop Webcam & Capture Image
    stopCameraButton.addEventListener("click", () => {
        if (webcamStream) {
            captureImage();
            webcamStream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
            webcamStream = null;
            console.log("Webcam stopped.");
        }
    });

    // Capture Image from Video
    function captureImage() {
        if (!videoElement.videoWidth || !videoElement.videoHeight) {
            console.error("Video frame not ready.");
            return;
        }

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            capturedBlob = blob;
            console.log("Image captured successfully.");

            // Preview the captured image
            const imageURL = URL.createObjectURL(blob);
            imagePreview.src = imageURL;
            imagePreview.style.width = "100%";
            document.body.appendChild(imagePreview);
        }, "image/png");
    }

        // Send Captured Image to Backend for Recognition
        function sendImageToBackend() {
            if (!capturedBlob) {
                alert("No image captured! Please stop the camera first.");
                return;
            }
    
            const formData = new FormData();
            formData.append("file", capturedBlob);
    
            fetch("http://localhost:5000/classify", {
                method: "POST",
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log("Server Response:", data);
    
                if (data.emotion) {
                    statusText.textContent = `Detected: ${data.emotion}`;
                }
    
                if (data.color) {
                    // Instead of changing the extension popup color, send message to content script
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        if (tabs.length > 0) {
                            chrome.scripting.executeScript({
                                target: { tabId: tabs[0].id },
                                func: (color) => {
                                    document.body.style.backgroundColor = color;
                                },
                                args: [data.color] // Pass detected color to content script
                            });
                        }
                    });
                }
            })
            .catch(error => console.error("Error sending image:", error));
        }


    // Enable/Disable FaceFluent & Send Image for Recognition
    toggleButton.addEventListener("click", () => {
        isEnabled = !isEnabled;
        statusText.textContent = isEnabled ? "Enabled" : "Disabled";
        toggleButton.textContent = isEnabled ? "Disable FaceFluent" : "Enable FaceFluent";

        if (isEnabled) {
            sendImageToBackend();
        }
    });

    // Redirect to Home Page When Clicked
    homePageButton.addEventListener("click", () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("home.html") });
    });
}); 