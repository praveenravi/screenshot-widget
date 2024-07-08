// widget.js
(function() {
    // EmailJS configuration
    const emailjsUserID = 'YOUR_EMAILJS_USER_ID'; // Replace with your EmailJS user ID
    const emailjsServiceID = 'YOUR_EMAILJS_SERVICE_ID'; // Replace with your EmailJS service ID
    const emailjsTemplateID = 'YOUR_EMAILJS_TEMPLATE_ID'; // Replace with your EmailJS template ID
    const predefinedName = 'QA Tester'; // Replace with the predefined name
    const predefinedEmail = 'qa@example.com'; // Replace with the predefined email

    // Load EmailJS SDK
    function loadEmailJSScript(callback) {
        const script = document.createElement('script');
        script.src = 'https://cdn.emailjs.com/dist/email.min.js';
        script.onload = callback;
        script.onerror = function() {
            console.error('Failed to load EmailJS SDK');
        };
        document.head.appendChild(script);
    }

    // Function to load an external script
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = function() {
            console.error(`Failed to load script: ${src}`);
        };
        document.head.appendChild(script);
    }

    // Create a sliding panel
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.left = '0';
    panel.style.bottom = '-300px'; // Initially hidden
    panel.style.width = '100%';
    panel.style.height = '300px';
    panel.style.backgroundColor = '#fff';
    panel.style.boxShadow = '0 -2px 5px rgba(0,0,0,0.5)';
    panel.style.transition = 'bottom 0.3s ease';
    panel.style.zIndex = '1000';
    panel.style.padding = '10px';
    panel.style.display = 'flex'; // Use flexbox for layout

    // Create a container for the contact form
    const formContainer = document.createElement('div');
    formContainer.style.flex = '1'; // 50% of the panel
    formContainer.style.padding = '10px';

    // Create the contact form
    const form = document.createElement('form');
    form.innerHTML = `
        <h3>Bug Details</h3>
        <label for="details">Details:</label><br>
        <textarea id="details" name="details" style="width: 100%; padding: 5px; margin-bottom: 10px;"></textarea><br>
        <label for="severity">Severity:</label><br>
        <select id="severity" name="severity" style="width: 100%; padding: 5px; margin-bottom: 10px;">
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium" selected>Medium</option>
            <option value="Low">Low</option>
        </select><br>
        <label for="priority">Priority:</label><br>
        <select id="priority" name="priority" style="width: 100%; padding: 5px; margin-bottom: 10px;">
            <option value="1">1</option>
            <option value="2" selected>2</option>
            <option value="3">3</option>
            <option value="4">4</option>
        </select><br>
        <button type="submit" style="background-color: #007BFF; color: white; border: none; padding: 10px; width: 100%; border-radius: 5px; cursor: pointer;">Submit</button>
    `;

    // Append the form to the form container
    formContainer.appendChild(form);

    // Create a container for the screenshot preview
    const previewContainer = document.createElement('div');
    previewContainer.style.flex = '1'; // 50% of the panel
    previewContainer.style.padding = '10px';

    // Create an image element for the preview
    const imgPreview = document.createElement('img');
    imgPreview.style.width = '100%';
    imgPreview.style.border = '1px solid #ccc';
    imgPreview.style.backgroundColor = '#f0f0f0';
    imgPreview.style.display = 'none'; // Hide initially

    // Append the image preview to the preview container
    previewContainer.appendChild(imgPreview);

    // Append the form container and preview container to the panel
    panel.appendChild(formContainer);
    panel.appendChild(previewContainer);
    document.body.appendChild(panel);

    // Create a button to toggle the panel
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '<img src="toggle-icon.png" alt="Toggle" style="width: 20px; height: 20px;">'; // Use an icon
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '60px'; // Position to avoid overlap with screenshot button
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '1001';
    toggleButton.style.padding = '10px';
    toggleButton.style.backgroundColor = '#007BFF';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';

    // Create a button element to take a screenshot
    const screenshotButton = document.createElement('button');
    screenshotButton.innerHTML = '<img src="screenshot-icon.png" alt="Screenshot" style="width: 20px; height: 20px;">'; // Use an icon
    screenshotButton.style.position = 'fixed';
    screenshotButton.style.bottom = '10px'; // Position to avoid overlap with toggle button
    screenshotButton.style.right = '10px';
    screenshotButton.style.zIndex = '1001';
    screenshotButton.style.padding = '10px';
    screenshotButton.style.backgroundColor = '#007BFF';
    screenshotButton.style.color = 'white';
    screenshotButton.style.border = 'none';
    screenshotButton.style.borderRadius = '5px';
    screenshotButton.style.cursor = 'pointer';

    // Append the toggle button and screenshot button to the body
    document.body.appendChild(toggleButton);
    document.body.appendChild(screenshotButton);

    // Function to toggle the sliding panel
    function togglePanel() {
        if (panel.style.bottom === '0px') {
            panel.style.bottom = '-300px';
        } else {
            panel.style.bottom = '0px';
        }
    }

    // Function to take a screenshot
    function takeScreenshot() {
        if (typeof html2canvas !== 'function') {
            console.error('html2canvas library is not loaded.');
            return;
        }
        
        html2canvas(document.body)
            .then(function(canvas) {
                const dataUrl = canvas.toDataURL('image/png');
                imgPreview.src = dataUrl;
                imgPreview.style.display = 'block'; // Show the image preview
            })
            .catch(function(error) {
                console.error('Error taking screenshot:', error);
                alert('An error occurred while taking the screenshot. Please try again.');
            });
    }

    // Function to send the email with the screenshot and bug details
    function sendEmail(event) {
        event.preventDefault(); // Prevent form submission

        const details = document.getElementById('details').value;
        const severity = document.getElementById('severity').value;
        const priority = document.getElementById('priority').value;
        const screenshot = imgPreview.src;

        if (!screenshot) {
            alert('Please take a screenshot before submitting the bug report.');
            return;
        }

        emailjs.send(emailjsServiceID, emailjsTemplateID, {
            name: predefinedName,
            email: predefinedEmail,
            details: details,
            severity: severity,
            priority: priority,
            screenshot: screenshot
        }, emailjsUserID)
        .then(function(response) {
            alert('Bug report sent successfully!');
            form.reset();
            imgPreview.style.display = 'none'; // Hide the image preview
            togglePanel(); // Toggle the panel back
        }, function(error) {
            console.error('Failed to send email:', error);
            alert('Failed to send bug report. Please try again.');
        });
    }

    // Add click events to the buttons
    toggleButton.addEventListener('click', togglePanel);
    screenshotButton.addEventListener('click', takeScreenshot);
    form.addEventListener('submit', sendEmail);

    // Load EmailJS SDK and html2canvas library
    loadEmailJSScript(function() {
        emailjs.init(emailjsUserID);
        console.log('EmailJS SDK loaded successfully.');

        loadScript('http://html2canvas.hertzen.com/dist/html2canvas.js', function() {
            console.log('html2canvas library loaded successfully.');
        });
    });
})();
