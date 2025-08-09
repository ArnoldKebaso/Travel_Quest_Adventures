# SAM Deployment Commands with S3 Bucket Setup

## 1. Install AWS CLI (if not already installed)

### For Windows PowerShell:
```powershell
# Download and install AWS CLI v2
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi /quiet

# Or use winget
winget install Amazon.AWSCLI
```

### For Windows using Chocolatey:
```powershell
# Install using Chocolatey
choco install awscli
```

## 2. Configure AWS Credentials

```powershell
# Configure AWS credentials (use your AWS Academy credentials)
aws configure

# You'll be prompted for:
# AWS Access Key ID: [Your Access Key]
# AWS Secret Access Key: [Your Secret Key]
# Default region name: us-east-1
# Default output format: json
```

## 3. Create S3 Bucket for SAM Deployment

### Get Account ID and Region for Unique Bucket Naming:
```powershell
# Get your AWS account ID
aws sts get-caller-identity --query Account --output text

# Set variables for bucket naming
$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
$REGION = "us-east-1"
$BUCKET_NAME = "travelquest-sam-deployments-$ACCOUNT_ID-$REGION"
```

### Create the S3 Bucket:
```powershell
# Create S3 bucket for SAM artifacts
aws s3 mb s3://travelquest-sam-deployments-$ACCOUNT_ID-$REGION --region $REGION

# Or with a simpler name (ensure it's globally unique)
aws s3 mb s3://travelquest-sam-deploy-$(Get-Random) --region us-east-1
```

### Verify S3 Bucket Creation:
```powershell
# List your S3 buckets
aws s3 ls

# Check if the specific bucket exists
aws s3 ls s3://travelquest-sam-deployments-$ACCOUNT_ID-$REGION
```

## 4. SAM Build and Deploy Commands

### Navigate to Backend Directory:
```powershell
cd "C:\Users\Admin\Desktop\apps\TravelQuest Adventures App\Starter\travelquest\travelquest-backend-new"
```

### Build the SAM Application:
```powershell
# Build the SAM application
sam build
```

### Deploy with Guided Setup (First Time):
```powershell
# Deploy with guided configuration
sam deploy --guided --s3-bucket travelquest-sam-deployments-$ACCOUNT_ID-$REGION

# You'll be prompted for:
# Stack Name: travelquest-backend
# AWS Region: us-east-1
# Parameter Stage: dev
# Confirm changes before deploy: Y
# Allow SAM CLI IAM role creation: Y
# Save parameters to samconfig.toml: Y
```

### Deploy with Existing Configuration:
```powershell
# Subsequent deployments
sam deploy
```

## 5. Alternative: One-Command Deployment with Auto S3 Bucket

```powershell
# SAM will create an S3 bucket automatically if not specified
sam deploy --guided

# This will prompt you and create a managed S3 bucket automatically
```

## 6. Manual S3 Bucket Creation (Direct Commands)

### Option 1: Using Account ID for Unique Naming
```bash
# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create bucket with account ID
aws s3 mb s3://travelquest-sam-artifacts-$ACCOUNT_ID --region us-east-1

# Enable versioning (recommended)
aws s3api put-bucket-versioning \
    --bucket travelquest-sam-artifacts-$ACCOUNT_ID \
    --versioning-configuration Status=Enabled
```

### Option 2: Using Timestamp for Unique Naming
```bash
# Create bucket with timestamp
TIMESTAMP=$(date +%Y%m%d%H%M%S)
aws s3 mb s3://travelquest-sam-deploy-$TIMESTAMP --region us-east-1
```

### Option 3: Simple Naming (Check Availability First)
```bash
# Check if bucket name is available
aws s3api head-bucket --bucket travelquest-sam-deployments-2024 2>/dev/null

# Create bucket if available
aws s3 mb s3://travelquest-sam-deployments-2024 --region us-east-1
```

## 7. Verify Deployment Success

### Check CloudFormation Stack:
```powershell
# List CloudFormation stacks
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE

# Get stack outputs
aws cloudformation describe-stacks --stack-name travelquest-backend --query 'Stacks[0].Outputs'
```

### Get API Gateway URL:
```powershell
# Get the API endpoint URL
sam list stack-outputs --stack-name travelquest-backend
```

### Test API Endpoints:
```powershell
# Get the API Gateway URL from outputs
$API_URL = sam list stack-outputs --stack-name travelquest-backend --output json | ConvertFrom-Json | Where-Object {$_.OutputKey -eq "TravelQuestApiUrl"} | Select-Object -ExpandProperty OutputValue

# Test the destinations endpoint
curl "$API_URL/destinations"
```

## 8. Cleanup Commands (if needed)

### Delete S3 Bucket Contents and Bucket:
```powershell
# Remove all objects from bucket
aws s3 rm s3://travelquest-sam-deployments-$ACCOUNT_ID-$REGION --recursive

# Delete the bucket
aws s3 rb s3://travelquest-sam-deployments-$ACCOUNT_ID-$REGION
```

### Delete CloudFormation Stack:
```powershell
# Delete the entire stack
aws cloudformation delete-stack --stack-name travelquest-backend

# Wait for deletion to complete
aws cloudformation wait stack-delete-complete --stack-name travelquest-backend
```

## 9. Troubleshooting

### Common S3 Bucket Issues:
```powershell
# Check bucket policy
aws s3api get-bucket-policy --bucket your-bucket-name

# Check bucket location
aws s3api get-bucket-location --bucket your-bucket-name

# List bucket contents
aws s3 ls s3://your-bucket-name --recursive
```

### SAM Deployment Issues:
```powershell
# Check SAM logs
sam logs -n GetAllDestinationsFunction --stack-name travelquest-backend

# Validate SAM template
sam validate

# Check CloudFormation events
aws cloudformation describe-stack-events --stack-name travelquest-backend
```

---

## Quick Start Commands Summary:

```powershell
# 1. Install AWS CLI (if needed)
winget install Amazon.AWSCLI

# 2. Configure AWS
aws configure

# 3. Create S3 bucket
$ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
aws s3 mb s3://travelquest-sam-deploy-$ACCOUNT_ID --region us-east-1

# 4. Deploy SAM
cd "C:\Users\Admin\Desktop\apps\TravelQuest Adventures App\Starter\travelquest\travelquest-backend-new"
sam build
sam deploy --guided --s3-bucket travelquest-sam-deploy-$ACCOUNT_ID

# 5. Get API URL
sam list stack-outputs --stack-name travelquest-backend
```
