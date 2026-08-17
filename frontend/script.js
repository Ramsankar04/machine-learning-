document.getElementById("predictionForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const resultBox = document.getElementById("result");
    const resultText = document.getElementById("resultText");
    const resultMessage = document.getElementById("resultMessage");
    const resultIcon = document.getElementById("resultIcon");

    // Collect the values from the form
    const data = {
        duration: Number(document.getElementById("duration").value),
        protocol_type: document.getElementById("protocol_type").value,
        service: document.getElementById("service").value,
        flag: document.getElementById("flag").value,
        src_bytes: Number(document.getElementById("src_bytes").value),
        dst_bytes: Number(document.getElementById("dst_bytes").value)
    };

    try {

        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        resultBox.classList.remove("hidden");

        resultText.textContent = result.prediction;

        if (result.prediction === "NORMAL") {
            resultIcon.textContent = "✓";
            resultMessage.textContent = "Network activity appears normal.";
        } else {
            resultIcon.textContent = "!";
            resultMessage.textContent = "Potential network intrusion detected.";
        }

    } catch (error) {

        resultBox.classList.remove("hidden");

        resultText.textContent = "ERROR";
        resultMessage.textContent =
            "Unable to connect to the detection server.";

        console.error(error);
    }
});