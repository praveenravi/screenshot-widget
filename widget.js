// widget.js
(function() {
    // Function to load an external script
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = function() {
            console.error('Failed to load script: ${src}');
        };
        document.head.appendChild(script);
    }

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
    function takeScreenshot() {
        if (typeof html2canvas !== 'function') {
            console.error('html2canvas library is not loaded.');
            return;
        }
        
        html2canvas(document.body).then(function(canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'screenshot.png';
            link.click();
        }).catch(function(error) {
            console.error('Error taking screenshot:', error);
        });
    }

    // Add click event to the button
    button.addEventListener('click', takeScreenshot);

    // Load html2canvas library and initialize the widget
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js', function() {
        console.log('html2canvas library loaded successfully.');
    });
})();
