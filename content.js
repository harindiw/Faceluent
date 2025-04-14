// Apply stored setting when the page loads
chrome.storage.sync.get(["adaptationEnabled"], function (data) {
    let isEnabled = data.adaptationEnabled || false;
    document.body.style.backgroundColor = isEnabled ? "#E6FFCC" : "";
});

(async function () {
    console.log("Initializing Webcam Capture...");

    let video = null;
    let canvas = null;
    let ctx = null;
    let capturedBlob = null;

    async function startVideo() {
        try {
            if (!video) {
                video = document.createElement("video");
                video.setAttribute("autoplay", "");
                video.setAttribute("playsinline", ""); // Better mobile support
                video.style.position = "fixed";
                video.style.top = "10px";
                video.style.right = "10px";
                video.style.width = "150px"; // Small preview
                video.style.border = "2px solid black";
                document.body.appendChild(video);
            }

            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            console.log("Webcam started.");

            if (!canvas) {
                canvas = document.createElement("canvas");
                ctx = canvas.getContext("2d");
                document.body.appendChild(canvas);
            }

        } catch (err) {
            console.error("Webcam error:", err);
        }
    }

    // Stop webcam and capture frame
    function stopVideo() {
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            console.log("Webcam stopped.");
        }
    }

    // Capture Image from Webcam
    function captureImage() {
        if (!video.videoWidth || !video.videoHeight) {
            console.error("Video frame not ready.");
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            capturedBlob = blob;
            console.log("Image captured successfully.");
        }, "image/png");
    }

    startVideo();
})();
