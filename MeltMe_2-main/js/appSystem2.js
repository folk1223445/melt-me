// DEFINITION

//  timeLeft = 1500;    Time that is not constant
//  totalTime = 1500;   Constant 
//  extraTime = 6;      More Rest
//  bufferNowTime;      timeLeft interval



///////////////////////////// Audio section ////////////////////////////////////
const audio = document.getElementById('background-music');
const button = document.getElementById('toggle-button');
const volumeSlider = document.getElementById('volume-slider');
const AudioPanel = document.getElementById('AudioPanel');

// Toggle Audio panel visibility
function toggleAudio() {
    AudioPanel.style.display = (AudioPanel.style.display === "block") ? "none" : "block";
}

let isMusicPlaying = false;

//button Music click
button.addEventListener('click', () => {
    if (isMusicPlaying) {
        audio.pause();
        button.textContent = "Turn Music Off";
        button.style.backgroundColor = "rgb(246, 25, 25)"; // Change background
        
    } else {
        // Play
        audio.play();
        button.textContent = "Turn Music On";
        button.style.backgroundColor = "rgb(139, 209, 35)"; // Change background
    }
    //NjYwMTAzMzggd2FzIHRoZSBjcmVhdG9y
    // Toggle the music state
    isMusicPlaying = !isMusicPlaying;
});

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});



///////////////////////////// System section ////////////////////////////////////
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");

const timer = document.getElementById("timer");

const moreButton = document.getElementById('more');
moreButton.style.backgroundColor = 'rgb(255, 165, 0)'; 
moreButton.style.display = 'none';

let timeLeft = 10;
let totalTime = 10; // Set full duration (25min)
let extraTime = 6;
let bufferNowTime;
let fireInterval;
let smokeInterval;
let isExtraTimeRunning = false;


      
function updateButtons() {
    if (extraTime === 0) {
        moreButton.style.display = 'inline-block';
        stop.style.display = 'none';
        start.disabled = false;
    } else {
        stop.style.display = 'inline-block';
        moreButton.style.display = 'none';
    }
}


const updateTimer = () => {
    
    const minutes = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timer.innerHTML = `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    
};

updateTimer(); // Initialize the timer display
const updateExtra = () => {
    
    const min = Math.floor(extraTime / 60);
    const sec = extraTime % 60;
        timer.innerHTML = `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    
    };
    
    if(start.disabled = true && timeLeft == 0){
            alert("Pls, Click reset");
        }
    
const startTimer = () =>{
    
    start.disabled = true; // Disable start button to prevent spamming
    start.style.backgroundColor = "rgb(74, 116, 11)";
    stop.style.backgroundColor = "rgb(246, 25, 25)";
    

    bufferNowTime = setInterval(() => {

        if (timeLeft > 0) {
            start.disabled = true;
            timeLeft--;
            document.getElementById("candle").style.height = (100 * (timeLeft / totalTime)) + "px";
            updateTimer();
        }else{
            alert("Session end!"); 
            start.disabled = true;
            clearInterval(bufferNowTime);
            clearInterval(fireInterval); // Stop fire particles
            clearInterval(smokeInterval); // Stop smoke particles 
            document.getElementById("flame").style.display = "none";
            createSmoke(); 
            timeLeft=0;
            updateTimer();
            
            //extraTime = 5;
            const extraCountdown = setInterval(() => {
                if(timeLeft==0){
                    stop.disabled = true;
                    stop.style.backgroundColor = "rgb(85, 85, 85)";
                    start.disabled = true;
                    start.style.backgroundColor = "rgb(85, 85, 85)";
                }
                
                if (extraTime > 0 ) {
                    extraTime--;
                    updateExtra(); // Update extratimer display
                    updateButtons();
                } else {
                    reset.disabled = false;
                    clearInterval(extraCountdown);
                    //   alert("Extra time over!"); 
                }
            }, 1000);
        }
        
        
    }, 1000);//-1000ms = 1secs
    
    smokeInterval = setInterval(createSmokeParticles, 1500); // Generate smoke while flame is burning
    fireInterval = setInterval(createFireParticles, 500); // Generate fire particles
    clearInterval(extraCountdown);
};
    
        
        
const stopTimer = () => {
    clearInterval(bufferNowTime);
    clearInterval(fireInterval); // Stop fire particles
    clearInterval(smokeInterval); // Stop smoke particles when the flame is out
    
    //  Time under or  =  expected val
    updateTimer();
    start.disabled = false; // can press start
    start.style.backgroundColor = "rgb(146, 232, 16)";
    stop.style.backgroundColor = "rgb(109, 12, 12)";
    
    
    
    
};

    
      
//////////////////////////////// Reset Button ///////////////// 
const resetTimer = () => {
    if(timeLeft==10){
        start.disabled = false;
        stop.disabled = false;
        start.style.backgroundColor = "rgb(139, 209, 35)";
        stop.style.backgroundColor = "rgb(246, 25, 25)";
        clearInterval(bufferNowTime);
        clearInterval(fireInterval); // Stop fire particles
        clearInterval(smokeInterval); // Stop smoke particles when the flame is out
    }
    start.disabled = false;
    stop.disabled = false;
    start.style.backgroundColor = "rgb(139, 209, 35)";
    stop.style.backgroundColor = "rgb(246, 25, 25)";
    clearInterval(bufferNowTime);
    clearInterval(fireInterval); // Stop fire particles
    clearInterval(smokeInterval); // Stop smoke particles when the flame is out
    
    updateButtons();
    //extraTime = 0; //secs
    timeLeft = 10; // รีเซ็ตเวลา
    updateTimer();
    
    document.getElementById("candle").style.height = "100px"; // Height candle reset
    document.getElementById("flame").style.display = "block"; // Flame reset to Default

        
    };




//////////////////// Candle Animate : Head //////////////////////////

function createFireParticles() {
    if (timeLeft <= 0) return; // Stop fire particles when time is up

    for (let i = 0; i < 3; i++) {  
        setTimeout(() => {
            const fire = document.createElement("div");
            fire.classList.add("fire-particle");

            // More random positioning
            let randomX = Math.random() * 20 - 10; // Random left movement (-10 to 10)
            let randomY = Math.random() * 10 - 5;  // Random upward movement (-5 to 5)
            
            fire.style.left = `calc(50% + ${randomX}px)`;
            fire.style.top = `calc(-50px + ${randomY}px)`;
            fire.style.animationDuration = (0.5 + Math.random() * 0.5) + "s"; 
            
            document.getElementById("candle").appendChild(fire);
            setTimeout(() => fire.remove(), 1000); // Remove fire after animation
        }, i * 100);
    }
}

function createSmokeParticles() {
    if (timeLeft <= 0) return; // Stop smoke particles when time is up

    for (let i = 0; i < 3; i++) {  
        setTimeout(() => {
            const smoke = document.createElement("div");
            smoke.classList.add("smoke-particle");

            // More random positioning
            let randomX = Math.random() * 20 - 10; // Random left movement (-10 to 10)
            let randomY = Math.random() * 15 - 7;  // Random slight vertical variation (-7 to 7)

            smoke.style.left = `calc(50% + ${randomX}px)`;
            smoke.style.top = `calc(-70px + ${randomY}px)`;
            smoke.style.animationDuration = (2 + Math.random()) + "s"; // Random duration

            document.getElementById("candle").appendChild(smoke);
            setTimeout(() => smoke.remove(), 3000); // Remove after animation
        }, i * 300);
    }
}



function createSmoke() {
    const smoke = document.createElement("div");
    smoke.classList.add("smoke");
    document.getElementById("candle").appendChild(smoke);
    setTimeout(() => smoke.remove(), 2000); // Remove after animation
}
///////////////////// End Candle Animate /////////////////////////

document.addEventListener("visibilitychange", () => {
    if (document.hidden && timeLeft!=0 && timeLeft != totalTime) {
        stopTimer();
        alert("Dont left the candle on fire! Too dangerous!");
        
    }
});

// More rest Logic is here 
moreButton.addEventListener('click', () => {
    moreButton.style.display = 'none';
    if (timeLeft === 0 && extraTime === 0) {
        extraTime += 8; // Add 8 seconds extra time
        updateButtons();
        updateExtra(); // Update the extra time countdown
        const moreTimeInterval = setInterval(() => {
            if (extraTime > 0 && timeLeft === 0 ) {
                extraTime--;
                updateExtra(); // Update the extra time countdown
                updateButtons();
                //clearInterval(moreTimeInterval);
            } else {
                clearInterval(moreTimeInterval);
                reset.disabled = false;
            }
        }, 1000);
        
        
    }
    
    clearInterval(moreTimeInterval);
    updateButtons();
});

start.addEventListener("click", ()=>{
    if(timeLeft == 0){
        start.style.backgroundColor = "rgb(85, 85, 85)";
        alert("Pls, Click reset");
    }else{startTimer();}
});


stop.addEventListener("click", ()=>{
    if(stop.disabled = true && timeLeft == 0){
        stop.style.backgroundColor = "rgb(85, 85, 85)";
    }else{stopTimer();}
});


reset.addEventListener("click", resetTimer);
        
        
    
///////////////////////////// Just go back ////////////////////   
function goBack() {
    window.location.href = "home.html";
}