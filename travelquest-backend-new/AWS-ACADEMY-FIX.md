# AWS Academy Deployment Fix

## Issue: IAM Permission Errors

Your AWS Academy account doesn't have permission to create IAM roles. We need to use a simplified template.

## Solution: Create a minimal working version

The error shows:
```
User: arn:aws:sts::538288912277:assumed-role/voclabs/user4224988=choudha22@culonuni.coventry.ac.uk 
is not authorized to perform: iam:CreateRole
```

## Quick Fix Options:

### Option 1: Simplified Template (Recommended)
Create a minimal template with fewer Lambda functions that might work within AWS Academy limits.

### Option 2: Remove Tags from Template
AWS Academy might have issues with resource tagging.

### Option 3: Deploy Individual Components
Deploy DynamoDB tables first, then Lambda functions separately.

## Let's try Option 1 - Simplified Template
I'll create a minimal version with just basic CRUD operations.
