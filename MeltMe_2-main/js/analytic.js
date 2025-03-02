document.addEventListener("DOMContentLoaded", function () {
    const ctxDonut = document.getElementById("donutChart")?.getContext("2d");

    if (!ctxDonut) {
        console.error("❌ ไม่พบ canvas ของกราฟ");
        return;
    }

    function loadStudyData() {
        let studyData = JSON.parse(localStorage.getItem("studyData")) || {};
        let subjects = Object.keys(studyData);
        let studyTimes = Object.values(studyData).map(seconds => Math.round(seconds / 60)); // แปลงเป็นนาที

        // ถ้าไม่มีข้อมูล แสดง "No Data"
        if (subjects.length === 0 || studyTimes.every(time => time === 0)) {
            subjects = ["No Data"];
            studyTimes = [1];
        }

        console.log("📊 Data loaded:", subjects, studyTimes);
        createDonutChart(subjects, studyTimes);
    }

    function createDonutChart(labels, data) {
        if (window.donutChart instanceof Chart) {
            window.donutChart.destroy();
        }

        const chartColors = ["#74c0fc", "#f4b860", "#c87b7b", "#a29bfe", "#fdcb6e", "#8e44ad", "#27ae60"];

        window.donutChart = new Chart(ctxDonut, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: chartColors.slice(0, labels.length),
                    hoverOffset: 4
                }]
            },
            options: { 
                responsive: true, 
                plugins: { 
                    legend: { position: "bottom" } 
                }
            }
        });
    }

    document.getElementById("resetData")?.addEventListener("click", function () {
        localStorage.removeItem("studyData");
        console.log("🗑 Data reset");
        loadStudyData();
    });

    loadStudyData();
});
