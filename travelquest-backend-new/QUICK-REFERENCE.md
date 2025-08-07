# Quick Reference: AWS Commands for TravelQuest Backend

## Essential DynamoDB Table Creation Commands

### 1. Destinations Table
```bash
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

### 2. Tours Table
```bash
aws dynamodb create-table \
    --table-name travelquest-tours \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=region,AttributeType=S \
        AttributeName=category,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=region-category-index,KeySchema=[{AttributeName=region,KeyType=HASH},{AttributeName=category,KeyType=RANGE}],Projection={ProjectionType=ALL} \
    --billing-mode PAY_PER_REQUEST
```

### 3. Blogs Table
```bash
aws dynamodb create-table \
    --table-name travelquest-blogs \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=category,AttributeType=S \
        AttributeName=publishedAt,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=category-publishedAt-index,KeySchema=[{AttributeName=category,KeyType=HASH},{AttributeName=publishedAt,KeyType=RANGE}],Projection={ProjectionType=ALL} \
    --billing-mode PAY_PER_REQUEST
```

### 4. Comments Table
```bash
aws dynamodb create-table \
    --table-name travelquest-comments \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST
```

## Quick SAM Deployment

```powershell
# 1. Build
sam build

# 2. Deploy (first time)
sam deploy --guided

# 3. Deploy (subsequent)
sam deploy

# 4. Get API URL
sam list stack-outputs --stack-name travelquest-backend
```

## Table Structure Summary

| Table | Primary Key | GSI | Purpose |
|-------|-------------|-----|---------|
| destinations | id (S) | region-category-index | Travel destinations |
| tours | id (S) | region-category-index | Tour packages |
| blogs | id (S) | category-publishedAt-index | Blog posts |
| comments | id (S) | None | User comments |

## Essential AWS CLI Checks

```bash
# List tables
aws dynamodb list-tables

# Check table status
aws dynamodb describe-table --table-name travelquest-destinations

# Get API Gateway endpoints
aws apigateway get-rest-apis

# Check Lambda functions
aws lambda list-functions --query 'Functions[?contains(FunctionName, `travelquest`)].FunctionName'
```

## Environment Setup

```bash
# Set region (if needed)
export AWS_DEFAULT_REGION=us-east-1

# Verify credentials
aws sts get-caller-identity

# Check SAM version
sam --version
```
