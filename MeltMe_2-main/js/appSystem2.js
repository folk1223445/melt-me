///////////////////////////// 🎵 Audio section ////////////////////////////////////
const audio = document.getElementById('background-music');
const button = document.getElementById('toggle-button');
const volumeSlider = document.getElementById('volume-slider');
const AudioPanel = document.getElementById('AudioPanel');

// Toggle Audio panel visibility
function toggleAudio() {
    AudioPanel.style.display = (AudioPanel.style.display === "block") ? "none" : "block";
}

let isMusicPlaying = false;

// Toggle Music
button.addEventListener('click', () => {
    if (isMusicPlaying) {
        audio.pause();
        button.textContent = "Turn Music Off";
        button.style.backgroundColor = "rgb(246, 25, 25)";
    } else {
        audio.play();
        button.textContent = "Turn Music On";
        button.style.backgroundColor = "rgb(139, 209, 35)";
    }
    isMusicPlaying = !isMusicPlaying;
});

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});


///////////////////////////// ⏳ System section ////////////////////////////////////
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const timer = document.getElementById("timer");
const moreButton = document.getElementById('more');

moreButton.style.backgroundColor = 'rgb(255, 165, 0)'; 
moreButton.style.display = 'none';

let timeLeft = 1500;  // 25 นาที
let totalTime = 1500; // เวลาทำงานปกติ
let extraTime = 300;  // 5 นาทีสำหรับพัก
let bufferNowTime;
let fireInterval;
let smokeInterval;
let isExtraTimeRunning = false;

// 📌 ฟังก์ชันส่งเวลาที่จับไป Backend
function sendStudyTimeToBackend(subject, timeSpent) {
    fetch("http://localhost:3000/study-time", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject, timeSpent: timeSpent })
    })
    .then(response => response.json())
    .then(data => console.log("📤 ข้อมูลถูกส่งสำเร็จ", data))
    .catch(error => console.error("❌ เกิดข้อผิดพลาด:", error));
}

// 📌 อัปเดต Timer บนหน้าจอ
const updateTimer = () => {
    const minutes = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timer.innerHTML = `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// 📌 ฟังก์ชันเริ่มจับเวลา
const startTimer = () => {
    start.disabled = true; 
    stop.disabled = false;

    // ✅ สร้างเอฟเฟคควันและไฟ
    smokeInterval = setInterval(createSmokeParticles, 1500); 
    fireInterval = setInterval(createFireParticles, 500);

    bufferNowTime = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        } else {
            clearInterval(bufferNowTime);
            handleTimeEnd();
        }
    }, 1000);
};

// 📌 ฟังก์ชันเมื่อเวลาหมด
function handleTimeEnd() {
    clearInterval(bufferNowTime);
    clearInterval(fireInterval);  
    clearInterval(smokeInterval); 

    // ดึงข้อมูลวิชาจาก localStorage
    let subject = localStorage.getItem("selectedTaskSubject") || "Unknown Subject";
    let timeSpent = totalTime;

    console.log("✅ ส่งข้อมูล:", subject, timeSpent);
    sendStudyTimeToBackend(subject, timeSpent);

    alert("⏳ Session ended! Data saved.");

    if (extraTime > 0) {
        startExtraTime();
    }
}

// 📌 ฟังก์ชันเริ่ม Extra Time (เวลาพัก)
function startExtraTime() {
    isExtraTimeRunning = true;
    timeLeft = extraTime;
    moreButton.style.display = "none";
    bufferNowTime = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        } else {
            clearInterval(bufferNowTime);
            alert("🎉 Extra Time Finished!");
            isExtraTimeRunning = false;
        }
    }, 1000);
}

// 📌 ฟังก์ชันหยุดจับเวลา
const stopTimer = () => {
    clearInterval(bufferNowTime);
    clearInterval(fireInterval);
    clearInterval(smokeInterval);
    updateTimer();
    start.disabled = false;
};

// 📌 ฟังก์ชันรีเซ็ต Timer
const resetTimer = () => {
    start.disabled = false;
    stop.disabled = false;
    timeLeft = totalTime;
    updateTimer();
};

// 📌 ปุ่ม More Rest (ขยายเวลาพัก)
moreButton.addEventListener('click', () => {
    if (!isExtraTimeRunning) {
        extraTime += 60;
        updateTimer();
    }
});

// 📌 ปุ่มควบคุม Timer
start.addEventListener("click", () => {
    if (timeLeft > 0) {
        startTimer();
    } else {
        alert("Please reset before starting again.");
    }
});

stop.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);

// 📌 ปุ่มกลับหน้า Home
function goBack() {
    window.location.href = "home.html";
}

updateTimer(); 


///////////////////////////// 🔥 เอฟเฟคควัน และ ไฟ ////////////////////////////////////

function createFireParticles() {
    if (timeLeft <= 0) return;

    for (let i = 0; i < 3; i++) {  
        setTimeout(() => {
            const fire = document.createElement("div");
            fire.classList.add("fire-particle");

            let randomX = Math.random() * 20 - 10; 
            let randomY = Math.random() * 10 - 5;  

            fire.style.left = `calc(50% + ${randomX}px)`;
            fire.style.top = `calc(-50px + ${randomY}px)`;
            fire.style.animationDuration = (0.5 + Math.random() * 0.5) + "s"; 
            
            document.getElementById("candle").appendChild(fire);
            setTimeout(() => fire.remove(), 1000);
        }, i * 100);
    }
}

function createSmokeParticles() {
    if (timeLeft <= 0) return;

    for (let i = 0; i < 3; i++) {  
        setTimeout(() => {
            const smoke = document.createElement("div");
            smoke.classList.add("smoke-particle");

            let randomX = Math.random() * 20 - 10;
            let randomY = Math.random() * 15 - 7;  

            smoke.style.left = `calc(50% + ${randomX}px)`;
            smoke.style.top = `calc(-70px + ${randomY}px)`;
            smoke.style.animationDuration = (2 + Math.random()) + "s"; 

            document.getElementById("candle").appendChild(smoke);
            setTimeout(() => smoke.remove(), 3000);
        }, i * 300);
    }
}

// 📌 เรียกใช้ควันเมื่อกดปุ่ม Start
function createSmoke() {
    const smoke = document.createElement("div");
    smoke.classList.add("smoke");
    document.getElementById("candle").appendChild(smoke);
    setTimeout(() => smoke.remove(), 2000);
}
