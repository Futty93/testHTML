// document.addEventListener('DOMContentLoaded', () => {
//     const startButton = document.getElementById('startButton');
//     const captureButton = document.getElementById('captureButton');
//     const webcamVideo = document.getElementById('webcamVideo');
//     const capturedImage = document.getElementById('capturedImage');
//     const webcamInfoContainer = document.getElementById('webcamInfo');
//     const webcamSelect = document.getElementById('webcamSelect');

//     if (startButton && captureButton && webcamVideo && capturedImage) {
//         let stream = null;
//         let imageCapture = null;

//         // Populate the webcam selection dropdown
//         async function populateWebcamSelect() {
//             const devices = await navigator.mediaDevices.enumerateDevices();
//             webcamSelect.innerHTML = '<option value="">Select a webcam</option>';
//             devices.forEach(device => {
//                 if (device.kind === 'videoinput') {
//                     const option = document.createElement('option');
//                     option.value = device.deviceId;
//                     option.text = device.label || 'Camera ' + (webcamSelect.options.length + 1);
//                     webcamSelect.appendChild(option);
//                 }
//             });
//         }

//         startButton.addEventListener('click', async () => {
//             try {

//                 const selectedWebcam = webcamSelect.value;
//                 if (!selectedWebcam) {
//                     console.log('Please select a webcam.');
//                     return;
//                 }
                
//                 stream = await navigator.mediaDevices.getUserMedia({
//                     video: {
//                         deviceId: { exact: selectedWebcam },
//                         width: 1240,
//                         height: 1080
//                     },
//                     audio: false
//                 });
//                 webcamVideo.srcObject = stream;
//                 imageCapture = new ImageCapture(stream.getVideoTracks()[0]);

//                 // Display connected webcam information in the HTML
//                 displayWebcamInfo(stream);
//             } catch (error) {
//                 console.error('Error accessing webcam:', error);
//             }
//         });

//         captureButton.addEventListener('click', async () => {
//             if (imageCapture) {
//                 try {
//                     const photoBlob = await imageCapture.takePhoto();
//                     capturedImage.src = URL.createObjectURL(photoBlob);
//                 } catch (error) {
//                     console.error('Error capturing image:', error);
//                 }
//             }
//         });

//         // Function to display connected media devices information in the HTML
//         function displayWebcamInfo(stream) {
//             const videoTrack = stream.getVideoTracks()[0];
//             if (videoTrack) {
//                 const settings = videoTrack.getSettings();
//                 const infoHTML = `
//                     <p><strong>Connected Webcam Information:</strong></p>
//                     <p><strong>Device:</strong> ${videoTrack.label || 'N/A'}</p>
//                     <p><strong>Width:</strong> ${settings.width}</p>
//                     <p><strong>Height:</strong> ${settings.height}</p>
//                     <p><strong>Frame Rate:</strong> ${settings.frameRate}</p>
//                 `;
//                 webcamInfoContainer.innerHTML = infoHTML;
//             }
//         }

//         // Populate the webcam selection dropdown
//         populateWebcamSelect();
//     }
// });

// async function startWebcam() {

//     const selectedResolution = select.value; // "1280x720"

//     const [width, height] = selectedResolution.split("x");

//     const constraints = {
//       video: {
//         width: parseInt(width, 10),
//         height: parseInt(height, 10),
//       },
//     };

//     stream = await navigator.mediaDevices.getUserMedia(constraints);
// //   stream = await navigator.mediaDevices.getUserMedia({video: true});

//   webcamVideo.srcObject = stream;

//   imageCapture = new ImageCapture(stream.getVideoTracks()[0]);

//   const track = stream.getVideoTracks()[0];

//   // Get camera capabilities
//   const capabilities = track.getCapabilities();

// // const resolutions = capabilities.height && capabilities.width
// //   ? Object.entries(capabilities.height).map(([,h]) => ({
// //       height: h,
// //       width: capabilities.width[h]  
// //   })) : [];

//   // Create info div
//   const infoDiv = document.createElement('div');

//   // Display camera name
//   const namePara = document.createElement('p');
//   namePara.textContent = `Camera Name: ${track.label}`;
//   infoDiv.appendChild(namePara);

//   // Display resolution
//   const resolutions = capabilities.height && capabilities.width ? 
//     Object.entries(capabilities.height).map(([,h]) => ({
//       height: h, 
//       width: capabilities.width[h]
//     })) : [];
//   const resolutionPara = document.createElement('p');
//   resolutionPara.textContent = `Resolutions: ${JSON.stringify(resolutions)}`;
//   infoDiv.appendChild(resolutionPara);

//   // ... other info ...
  
//   // Add div to page
//   document.body.appendChild(infoDiv);
// }


// Get DOM elements 
const startButton = document.getElementById('startButton');
const captureButton = document.getElementById('captureButton');
const webcamVideo = document.getElementById('webcamVideo');
const capturedImage = document.getElementById('capturedImage');
const resolutionSelect = document.getElementById('resolutionSelect');

// Camera stream and capture objects
let stream;
let imageCapture;

// Start the webcam
async function startWebcam() {

  // Get video stream
  stream = await navigator.mediaDevices.getUserMedia({video: true});
  
  // Set video source 
  webcamVideo.srcObject = stream;

  // Get track capabilities
  const track = stream.getVideoTracks()[0];
  const capabilities = track.getCapabilities();

  // Create resolution options
  const resolutions = getResolutions(capabilities);
  populateResolutionSelect(resolutions);

  // Set initial resolution
  updateResolution();

  // Get image capture
  imageCapture = new ImageCapture(track);
}

// Take a picture 
async function takePicture() {
  
  // Capture image 
  const image = await imageCapture.takePhoto();

  // Show image
  capturedImage.src = URL.createObjectURL(image);

}

// Update video stream resolution
function updateResolution() {

  // Get selected resolution value
  const selectedResolution = resolutionSelect.value;

  // Parse resolution string
  const [width, height] = selectedResolution.split('x');

  // Update stream constraints
  const constraints = {
    video: {
      width: parseInt(width, 10),
      height: parseInt(height, 10)
    }
  };

  // Restart stream
  stream.getTracks().forEach(track => track.stop());
  startWebcam(constraints); 

}

// Populate resolution select 
function populateResolutionSelect(resolutions) {
  resolutions.forEach((res) => {
    const option = document.createElement("option");
    option.value = `${res.width}x${res.height}`;
    option.text = `${res.width} x ${res.height}`;
    resolutionSelect.appendChild(option);
  });
}

// Get supported resolutions
function getResolutions(capabilities) {
  const resolutions =
    capabilities.height && capabilities.width
      ? Object.entries(capabilities.height).map(([, h]) => ({
          height: h,
          width: capabilities.width[h],
        }))
      : [];

  return resolutions;
}

// Start webcam when start button clicked
startButton.addEventListener('click', startWebcam); 

// Take picture when capture clicked 
captureButton.addEventListener('click', takePicture);

// Update resolution when selection changes
resolutionSelect.addEventListener('change', updateResolution);