async function uploadImage() {
    const input = document.getElementById("imageInput");
    if (input.files.length === 0) {
        alert("Please select an image.");
        return;
    }

    const formData = new FormData();
    formData.append("image", input.files[0]);

    try {
        const response = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        document.getElementById("outputText").textContent = data.text || "No text found.";
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to extract text.");
    }
}
