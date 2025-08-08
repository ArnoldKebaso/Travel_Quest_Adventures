# AWS Academy Deployment Solutions

## Problem: IAM Permission Limitations

Your AWS Academy account cannot create IAM roles (`iam:CreateRole`), which are required for Lambda functions.

## Solution Options:

### Option 1: Manual DynamoDB + Direct API Calls (Recommended)
Deploy only the DynamoDB tables and create a simple Express.js API that you can run locally or deploy to Vercel/Netlify.

### Option 2: Use AWS Academy CloudFormation Templates
Some AWS Academy courses provide pre-configured IAM roles you can reference.

### Option 3: Focus on Frontend + Mock API
Build the frontend and use mock API responses, then demonstrate the DynamoDB schema design.

### Option 4: Deploy DynamoDB Tables Only
Create the tables manually and show you understand the schema design.

## Let's Implement Option 1: Manual DynamoDB Tables

### Step 1: Create DynamoDB Tables Manually
```bash
# Create Destinations Table
aws dynamodb create-table \
    --table-name travelquest-destinations \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=region,AttributeType=S \
        AttributeName=category,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=region-category-index,KeySchema=[{AttributeName=region,KeyType=HASH},{AttributeName=category,KeyType=RANGE}],Projection={ProjectionType=ALL} \
    --billing-mode PAY_PER_REQUEST
```

### Step 2: Create Express.js API
Create a simple Node.js API that connects to DynamoDB and deploy it to Vercel.

### Step 3: Connect Frontend
Update your React frontend to call the API.

## Current Status: ✅ Successful Components

1. **Frontend**: ✅ Working with localStorage auth
2. **Backend Build**: ✅ SAM build successful
3. **DynamoDB Schema**: ✅ Designed and documented
4. **S3 Bucket**: ✅ Created successfully

## Next Steps:

1. Deploy DynamoDB tables manually
2. Create sample data
3. Build Express.js API for your frontend
4. Document the full architecture

Would you like me to help you with the manual DynamoDB creation or build a simple Express.js API?
