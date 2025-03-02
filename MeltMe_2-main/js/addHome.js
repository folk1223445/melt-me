document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("taskList");
    const saveTaskBtn = document.getElementById("saveTask");
    const subjectInput = document.getElementById("subject");
    const colorButtons = document.querySelectorAll(".color-option");
    let selectedColor = "#5A91E6"; // ค่าเริ่มต้น

    const LOCAL_STORAGE_KEY = "tasks"; // 🔗 Key สำหรับ localStorage

    // 📌 เมื่อคลิกเลือกสี ให้ตั้งค่าสีที่เลือก
    colorButtons.forEach(button => {
        button.addEventListener("click", function () {
            colorButtons.forEach(btn => btn.classList.remove("selected"));
            this.classList.add("selected");
            selectedColor = this.getAttribute("data-color");
            console.log("🎨 สีที่เลือก:", selectedColor);
        });
    });

    // 📌 โหลด Task จาก localStorage และแสดงในหน้า Home
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        taskList.innerHTML = "";
        tasks.forEach((task, index) => createTaskElement(task, index));
    }

    // 📌 บันทึก Task ลง localStorage
    function saveTask() {
        const subject = subjectInput.value.trim();

        if (!subject) {
            alert("❌ กรุณากรอกชื่อวิชา (Subject)");
            return;
        }

        const newTask = { subject, color: selectedColor };
        const tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        tasks.push(newTask);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));

        console.log("✅ บันทึก Task สำเร็จ:", newTask);
        window.location.href = "home.html"; // กลับไปหน้า Home
    }

    // 📌 ลบ Task ออกจาก localStorage
    function deleteTask(index) {
        let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        tasks.splice(index, 1);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
        loadTasks(); // โหลด Task ใหม่
    }

    // 📌 เมื่อกด Play ให้ไปหน้า delete.html และบันทึกข้อมูล Task
    function playTask(index) {
        let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        const task = tasks[index];

        if (task) {
            localStorage.setItem("selectedTaskSubject", task.subject);
            localStorage.setItem("selectedTaskColor", task.color);
            window.location.href = "system2.html";
        }
    }

    // 📌 สร้าง Task บนหน้า Home พร้อมปุ่ม Play ตรงกลาง
function createTaskElement(task, index) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.style.backgroundColor = task.color;
    taskDiv.style.position = "relative"; // ทำให้ปุ่ม Play อยู่ตรงกลางของ Task
    taskDiv.innerHTML = `
        <div class="task-header">
            <span class="task-category">${task.subject}</span>
            <button class="delete-task" data-index="${index}">X</button>
        </div>
        <button class="play-task" data-index="${index}"></button>
    `;
    taskList.appendChild(taskDiv);

    // กดปุ่มลบ Task
    taskDiv.querySelector(".delete-task").addEventListener("click", function () {
        deleteTask(index);
    });

    // กดปุ่ม Play เพื่อไปหน้า delete.html
    taskDiv.querySelector(".play-task").addEventListener("click", function () {
        playTask(index);
    });
}


    // 📌 โหลด Task เมื่อเปิดหน้า Home
    if (taskList) {
        loadTasks();
    }

    // 📌 บันทึก Task เมื่อกดปุ่ม Save
    if (saveTaskBtn) {
        saveTaskBtn.addEventListener("click", saveTask);
    }
});
