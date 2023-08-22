document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const captureButton = document.getElementById('captureButton');
    const webcamVideo = document.getElementById('webcamVideo');
    const capturedImage = document.getElementById('capturedImage');
    const webcamInfoContainer = document.getElementById('webcamInfo');
    const webcamSelect = document.getElementById('webcamSelect');

    if (startButton && captureButton && webcamVideo && capturedImage) {
        let stream = null;
        let imageCapture = null;

        // Populate the webcam selection dropdown
        async function populateWebcamSelect() {
            const devices = await navigator.mediaDevices.enumerateDevices();
            webcamSelect.innerHTML = '<option value="">Select a webcam</option>';
            devices.forEach(device => {
                if (device.kind === 'videoinput') {
                    const option = document.createElement('option');
                    option.value = device.deviceId;
                    option.text = device.label || 'Camera ' + (webcamSelect.options.length + 1);
                    webcamSelect.appendChild(option);
                }
            });
        }

        startButton.addEventListener('click', async () => {
            try {

                const selectedWebcam = webcamSelect.value;
                if (!selectedWebcam) {
                    console.log('Please select a webcam.');
                    return;
                }
                
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: { exact: selectedWebcam },
                        width: 1240,
                        height: 1080
                    },
                    audio: false
                });
                webcamVideo.srcObject = stream;
                imageCapture = new ImageCapture(stream.getVideoTracks()[0]);

                // Display connected webcam information in the HTML
                displayWebcamInfo(stream);
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        });

        captureButton.addEventListener('click', async () => {
            if (imageCapture) {
                try {
                    const photoBlob = await imageCapture.takePhoto();
                    capturedImage.src = URL.createObjectURL(photoBlob);
                } catch (error) {
                    console.error('Error capturing image:', error);
                }
            }
        });

        // Function to display connected media devices information in the HTML
        function displayWebcamInfo(stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                const settings = videoTrack.getSettings();
                const infoHTML = `
                    <p><strong>Connected Webcam Information:</strong></p>
                    <p><strong>Device:</strong> ${videoTrack.label || 'N/A'}</p>
                    <p><strong>Width:</strong> ${settings.width}</p>
                    <p><strong>Height:</strong> ${settings.height}</p>
                    <p><strong>Frame Rate:</strong> ${settings.frameRate}</p>
                `;
                webcamInfoContainer.innerHTML = infoHTML;
            }
        }

        // Populate the webcam selection dropdown
        populateWebcamSelect();
    }
});


