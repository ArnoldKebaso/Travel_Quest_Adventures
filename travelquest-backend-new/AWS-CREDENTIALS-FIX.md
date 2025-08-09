# AWS Academy Credentials Update Guide

## Getting Fresh AWS Academy Credentials

1. **Go to AWS Academy**:
   - Log into your AWS Academy portal
   - Click on "AWS Academy Learner Lab"
   - Click "Start Lab" to start your lab session

2. **Get AWS CLI Credentials**:
   - In the lab, click on "AWS Details"
   - Click "Show" next to "AWS CLI"
   - Copy the credentials block that looks like:
   ```
   [default]
   aws_access_key_id = ASIA...
   aws_secret_access_key = ...
   aws_session_token = ...
   ```

3. **Update Your Credentials**:
   - Open file: `C:\Users\Admin\.aws\credentials`
   - Replace the content with the copied credentials
   - OR run: `aws configure` and enter the new credentials

## Alternative: Set Environment Variables

Instead of updating the credentials file, you can set environment variables:

```powershell
# Set AWS credentials as environment variables
$env:AWS_ACCESS_KEY_ID = "YOUR_ACCESS_KEY"
$env:AWS_SECRET_ACCESS_KEY = "YOUR_SECRET_KEY"
$env:AWS_SESSION_TOKEN = "YOUR_SESSION_TOKEN"
$env:AWS_DEFAULT_REGION = "us-east-1"
```

## Verify Credentials Work

```powershell
# Test credentials
aws sts get-caller-identity

# Should return your account information without errors
```
