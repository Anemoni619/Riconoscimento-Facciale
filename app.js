//Libreria usata
//https://github.com/justadudewhohacks/face-api.js

const MODEL_URL = "data/face-api.js/weights"

const loader = document.getElementById("loader")
const webcam = document.getElementById("webcam")
//const webcamSize = {width: 1280, height:720}
const webcamSize = {width: 320, height:320}

webcam.addEventListener("play", async() => {
    const faceOverlay = faceapi.createCanvasFromMedia(webcam)
    document.body.append(faceOverlay)
    faceOverlay.style = 'z-index: 1; position: absolute; top: ' + webcam.offsetTop + ';left: ' + webcam.offsetLeft + ';'
    faceapi.matchDimensions(faceOverlay, webcamSize)
    setInterval ( async() => {
        const facesDetected = await faceapi.detectAllFaces(webcam).withFaceLandmarks().withFaceDescriptors()
        const resizedFaces = faceapi.resizeResults(facesDetected , webcamSize)
        faceOverlay.getContext('2d').clearRect(0, 0, faceOverlay.width, faceOverlay.height)
        //console.log(faceOverlay, resizedFaces)
        faceapi.draw.drawDetections(faceOverlay, resizedFaces)
        faceapi.draw.drawFaceLandmarks(faceOverlay, resizedFaces)
    },100)
})


let loadedPercentage = 1

const OnModelLoaded = () =>{
    loadedPercentage = loadedPercentage + 33
    loader.style = 'width: ' + loadedPercentage + '%;'
}

loader.style = 'width: ' + loadedPercentage + '%;'

const InitWebCam = async () => {
    const constraints = { audio: false, video: webcamSize}
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

    webcam.srcObject = mediaStream    
    webcam.onloadedmetadata = async () => webcam.play()
}

const app = async () => {
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL).then(OnModelLoaded)
    await faceapi.loadFaceLandmarkModel(MODEL_URL).then(OnModelLoaded)
    await faceapi.loadFaceRecognitionModel(MODEL_URL).then(OnModelLoaded)
    InitWebCam()
}

app()