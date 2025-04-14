document.addEventListener("DOMContentLoaded", function () {
    const installRemoveButton = document.getElementById("installRemoveExtension");

    // Simulate whether the extension is installed
    let isInstalled = false;

    // Function to update button text based on state
    function updateButtonText() {
        installRemoveButton.innerText = isInstalled ? "Remove from Chrome" : "Add to Chrome";
        installRemoveButton.classList.toggle("add-button", !isInstalled);
        installRemoveButton.classList.toggle("remove-button", isInstalled);
    }

    // Add or Remove the Extension
    installRemoveButton.addEventListener("click", function () {
        isInstalled = !isInstalled;
        alert(isInstalled ? "Extension added to Chrome!" : "Extension removed from Chrome!");
        updateButtonText();
    });

    // Initial button state
    updateButtonText();
});
