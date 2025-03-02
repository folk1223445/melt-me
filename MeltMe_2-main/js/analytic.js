document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:3000/study-time"; // 🔗 URL Backend
    const chartCanvas = document.getElementById("studyChart").getContext("2d");

    let studyChart; // ตัวแปรสำหรับเก็บกราฟ

    // 📌 ฟังก์ชันโหลดข้อมูลการเรียนจาก Backend
    async function loadStudyData() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (!data || data.length === 0) {
                console.log("📌 ไม่มีข้อมูลการเรียนที่บันทึกไว้");
                return;
            }

            // 📌 จัดกลุ่มข้อมูลตามวิชา
            let subjects = [];
            let studyTimes = [];

            data.forEach(session => {
                let index = subjects.indexOf(session.subject);
                if (index === -1) {
                    subjects.push(session.subject);
                    studyTimes.push(session.timeSpent / 60); // แปลงจากวินาทีเป็นนาที
                } else {
                    studyTimes[index] += session.timeSpent / 60;
                }
            });

            console.log("📊 ข้อมูลที่โหลดจาก Backend:", subjects, studyTimes);

            // 📌 อัปเดตกราฟ
            updateChart(subjects, studyTimes);
        } catch (error) {
            console.error("❌ โหลดข้อมูลผิดพลาด:", error);
        }
    }

    // 📌 ฟังก์ชันอัปเดตกราฟ
    function updateChart(subjects, studyTimes) {
        if (studyChart) {
            studyChart.destroy(); // 🔥 ลบกราฟเก่าเพื่อสร้างใหม่
        }

        studyChart = new Chart(chartCanvas, {
            type: "bar", // ใช้ Bar Chart
            data: {
                labels: subjects,
                datasets: [{
                    label: "เวลาที่ใช้ไป (นาที)",
                    data: studyTimes,
                    backgroundColor: "rgba(54, 162, 235, 0.5)", // สีฟ้าโปร่งแสง
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "เวลา (นาที)"
                        }
                    }
                }
            }
        });
    }

    // 📌 โหลดข้อมูลเมื่อเปิดหน้า
    loadStudyData();
});
