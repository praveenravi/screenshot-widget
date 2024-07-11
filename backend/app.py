import requests
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

# Azure DevOps configuration
azure_organization = 'YOUR_ORGANIZATION'  # Replace with your Azure DevOps organization
azure_project = 'YOUR_PROJECT'  # Replace with your Azure DevOps project
azure_pat = 'YOUR_PAT'  # Replace with your Azure DevOps personal access token
azure_work_item_type = 'Bug'

# EmailJS configuration
emailjs_user_id = 'YOUR_EMAILJS_USER_ID'
emailjs_service_id = 'YOUR_EMAILJS_SERVICE_ID'
emailjs_template_id = 'YOUR_EMAILJS_TEMPLATE_ID'
predefined_name = 'QA Tester'
predefined_email = 'qa@example.com'

def create_azure_bug(title, description, severity, priority):
    url = f'https://dev.azure.com/{azure_organization}/{azure_project}/_apis/wit/workitems/$Bug?api-version=6.0'
    headers = {
        'Content-Type': 'application/json-patch+json',
        'Authorization': f'Basic {azure_pat}'
    }
    data = [
        {
            'op': 'add',
            'path': '/fields/System.Title',
            'from': None,
            'value': title
        },
        {
            'op': 'add',
            'path': '/fields/System.Description',
            'from': None,
            'value': description
        },
        {
            'op': 'add',
            'path': '/fields/Microsoft.VSTS.Common.Severity',
            'from': None,
            'value': severity
        },
        {
            'op': 'add',
            'path': '/fields/Microsoft.VSTS.Common.Priority',
            'from': None,
            'value': priority
        }
    ]
    response = requests.post(url, headers=headers, data=json.dumps(data))
    if response.status_code == 200:
        bug_id = response.json().get('id')
        return bug_id
    else:
        return None

def send_email(details, severity, priority, screenshot, bug_id):
    email_data = {
        'name': predefined_name,
        'email': predefined_email,
        'details': details,
        'severity': severity,
        'priority': priority,
        'screenshot': screenshot,
        'bug_id': bug_id
    }
    response = requests.post(
        f'https://api.emailjs.com/api/v1.0/email/send',
        json={
            'service_id': emailjs_service_id,
            'template_id': emailjs_template_id,
            'user_id': emailjs_user_id,
            'template_params': email_data
        }
    )
    if response.status_code == 200:
        return True
    else:
        return False

@app.route('/report_bug', methods=['POST'])
def report_bug():
    data = request.json
    title = data.get('title', 'Bug Report')
    description = data.get('description')
    severity = data.get('severity')
    priority = data.get('priority')
    screenshot = data.get('screenshot')

    bug_id = create_azure_bug(title, description, severity, priority)
    if bug_id:
        email_sent = send_email(description, severity, priority, screenshot, bug_id)
        if email_sent:
            return jsonify({'status': 'success', 'bug_id': bug_id}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Failed to send email'}), 500
    else:
        return jsonify({'status': 'error', 'message': 'Failed to create bug in Azure DevOps'}), 500

if __name__ == '__main__':
    app.run(debug=True)
