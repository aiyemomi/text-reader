const video = document.querySelector("video")
const textElement = document.querySelector("[data-text]")
const start = document.querySelector(".start-btn")
const speak = document.querySelector(".speak")
const offlineMessage = document.querySelector(".offline-message")

async function setup() {
    document.addEventListener("keypress", (e)=>{
        if(e.code !== "Space"){
            console.log("Please hit the space bar button")
        }
    })

    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.srcObject = mediaStream
    video.addEventListener("playing", async () => {
        const worker = await Tesseract.createWorker()
        await worker.loadLanguage("eng")
        await worker.initialize("eng")
        const canvas = document.createElement("canvas")
        canvas.width = video.width
        canvas.height = video.height

        document.addEventListener("keypress", async function (e) {
            if (e.code === "Space") {
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, video.width, video.height)
                const obj = await worker.recognize(canvas)
                const { data: { text } } = obj
                console.log(text);
                textElement.textContent = text
                speak.setAttribute('style', 'display: block')
                function speech() {
                    speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\s/g, " ")))
                }
                speak.addEventListener('click', speech)
            }
        })
        
    })
}

   function startSetup(){
    if(window.navigator.onLine === false){
        offlineMessage.style.display = "initial"
    }else{
    offlineMessage.style.display = "none";
    setup()
    }
   } 

start.addEventListener("click", startSetup)

