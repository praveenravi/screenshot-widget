// widget.js
(function() {
    // Create a button element
    const button = document.createElement('button');
    button.innerText = 'Take Screenshot';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Append the button to the body
    document.body.appendChild(button);

    // Function to take a screenshot
    async function takeScreenshot() {
        const canvas = await html2canvas(document.body);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'screenshot.png';
        link.click();
    }

    // Add click event to the button
    button.addEventListener('click', takeScreenshot);

    // Load html2canvas library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js';
    document.head.appendChild(script);
})();
