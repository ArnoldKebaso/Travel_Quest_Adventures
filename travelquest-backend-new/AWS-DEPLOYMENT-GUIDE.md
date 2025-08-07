# TravelQuest Backend AWS Deployment Guide

This comprehensive guide provides all AWS CLI commands and deployment steps needed to deploy the TravelQuest Node.js REST API on AWS serverless infrastructure.

## Overview

The TravelQuest backend implements a complete serverless REST API using:
- **AWS Lambda** for API endpoints (20+ functions)
- **Amazon API Gateway** for HTTP routing and CORS
- **Amazon DynamoDB** for data persistence (4 tables)
- **Amazon Cognito** for authentication and authorization
- **AWS SAM** for infrastructure as code

## Prerequisites

1. **AWS CLI** installed and configured with credentials
2. **SAM CLI v1.142.1+** installed
3. **Node.js 18.x** runtime
4. **Valid AWS Account** with appropriate permissions

### Verify Prerequisites
```powershell
# Check AWS CLI
aws --version

# Check SAM CLI
sam --version

# Check Node.js
node --version

# Verify AWS credentials
aws sts get-caller-identity
```

## DynamoDB Tables Structure

Based on the backend models analysis, the following 4 tables will be created:

### 1. Destinations Table
**Purpose**: Store travel destinations with location and pricing data
```yaml
Partition Key: id (String)
Global Secondary Index: region-category-index
  - Hash Key: region (String)
  - Range Key: category (String)
```

### 2. Tours Table
**Purpose**: Store tour packages linked to destinations
```yaml
Partition Key: id (String)
Global Secondary Index: region-category-index
  - Hash Key: region (String)
  - Range Key: category (String)
```

### 3. Blogs Table
**Purpose**: Store blog posts with SEO and content management
```yaml
Partition Key: id (String)
Global Secondary Index: category-publishedAt-index
  - Hash Key: category (String)
  - Range Key: publishedAt (String)
```

### 4. Comments Table
**Purpose**: Store comments with moderation capabilities
```yaml
Partition Key: id (String)
Supports polymorphic relationships via resourceType/resourceId fields
```

## AWS CLI Commands for Manual Table Creation

If you need to create tables manually (not recommended - use SAM deploy instead):

### Create Destinations Table
```bash
aws dynamodb create-table \
    --table-name travelquest-destinations \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=region,AttributeType=S \
        AttributeName=category,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=region-category-index,KeySchema=[{AttributeName=region,KeyType=HASH},{AttributeName=category,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### Create Tours Table
```bash
aws dynamodb create-table \
    --table-name travelquest-tours \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=region,AttributeType=S \
        AttributeName=category,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=region-category-index,KeySchema=[{AttributeName=region,KeyType=HASH},{AttributeName=category,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### Create Blogs Table
```bash
aws dynamodb create-table \
    --table-name travelquest-blogs \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=category,AttributeType=S \
        AttributeName=publishedAt,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=category-publishedAt-index,KeySchema=[{AttributeName=category,KeyType=HASH},{AttributeName=publishedAt,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### Create Comments Table
```bash
aws dynamodb create-table \
    --table-name travelquest-comments \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### Verify Table Creation
```bash
# List all tables
aws dynamodb list-tables

# Describe specific table
aws dynamodb describe-table --table-name travelquest-destinations

# Check table status
aws dynamodb wait table-exists --table-name travelquest-destinations
```

## Recommended SAM Deployment (Automated)

**This is the preferred method** as it creates all resources automatically:

### 1. Build the SAM Application
```powershell
# Navigate to backend directory
cd "C:\Users\Admin\Desktop\apps\TravelQuest Adventures App\Starter\travelquest\travelquest-backend-new"

# Build the application
sam build
```

### 2. Deploy to AWS
```powershell
# First-time deployment with guided setup
sam deploy --guided

# Or deploy with existing configuration
sam deploy
```

### 3. Get API Gateway URL
```powershell
# Get the API endpoint URL
sam list stack-outputs --stack-name travelquest-backend --region us-east-1
```

## Data Model Field Mappings

### Destination Entity Fields
```typescript
interface Destination {
  id: string;                    // Primary Key
  name: string;                 // Destination name
  region: string;               // GSI Hash Key
  category: string;             // GSI Range Key
  description: string;          // Long text
  shortDescription: string;     // Brief summary
  imageUrl: string;            // Main image
  images: string[];            // Gallery images
  price: number;               // Base price
  originalPrice?: number;       // Discount pricing
  rating: number;              // Average rating
  reviewCount: number;         // Number of reviews
  location: {                  // Nested object
    country: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  features: string[];          // Array of features
  highlights: string[];        // Key highlights
  included: string[];          // What's included
  notIncluded: string[];       // What's not included
  duration: string;            // Trip duration
  difficulty: string;          // Difficulty level
  groupSize: {                 // Nested object
    min: number;
    max: number;
  };
  nextAvailableDate: string;   // ISO date string
  tags: string[];              // Search tags
  isPopular: boolean;          // Featured flag
  createdAt: string;           // ISO timestamp
  updatedAt: string;           // ISO timestamp
}
```

### Tour Entity Fields
```typescript
interface Tour {
  id: string;                  // Primary Key
  destinationId: string;       // Foreign key to Destination
  name: string;               // Tour name
  description: string;        // Full description
  shortDescription: string;   // Brief summary
  region: string;             // GSI Hash Key
  category: string;           // GSI Range Key
  price: number;              // Tour price
  originalPrice?: number;     // Discount pricing
  duration: string;           // Tour duration
  difficulty: string;         // Difficulty level
  maxGroupSize: number;       // Maximum participants
  minAge: number;             // Minimum age requirement
  imageUrl: string;           // Main image
  images: string[];           // Gallery images
  includes: string[];         // What's included
  excludes: string[];         // What's excluded
  itinerary: Array<{          // Daily itinerary
    day: number;
    title: string;
    description: string;
    meals?: string[];
    accommodation?: string;
  }>;
  meetingPoint: {             // Nested object
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  cancellationPolicy: string; // Cancellation terms
  whatToBring: string[];      // Required items
  physicalRequirements: string; // Fitness requirements
  availableDates: string[];   // Available tour dates
  rating: number;             // Average rating
  reviewCount: number;        // Number of reviews
  tags: string[];             // Search tags
  isActive: boolean;          // Availability flag
  createdAt: string;          // ISO timestamp
  updatedAt: string;          // ISO timestamp
}
```

### BlogPost Entity Fields
```typescript
interface BlogPost {
  id: string;                 // Primary Key
  title: string;              // Post title
  slug: string;               // URL slug
  excerpt: string;            // Brief excerpt
  content: string;            // Full content (HTML/Markdown)
  author: {                   // Nested object
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  category: string;           // GSI Hash Key
  tags: string[];             // Post tags
  featuredImage: string;      // Main image
  images: string[];           // Content images
  seo: {                      // SEO metadata
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  status: 'draft' | 'published' | 'archived'; // Publication status
  publishedAt: string;        // GSI Range Key (ISO timestamp)
  scheduledAt?: string;       // Scheduled publication
  viewCount: number;          // Page views
  likeCount: number;          // User likes
  shareCount: number;         // Social shares
  commentCount: number;       // Number of comments
  readingTime: number;        // Estimated reading time (minutes)
  isCommentingEnabled: boolean; // Comments allowed
  isFeatured: boolean;        // Featured post flag
  relatedPosts: string[];     // Related post IDs
  createdAt: string;          // ISO timestamp
  updatedAt: string;          // ISO timestamp
}
```

### Comment Entity Fields
```typescript
interface Comment {
  id: string;                 // Primary Key
  resourceType: 'destination' | 'tour' | 'blog'; // Resource type
  resourceId: string;         // Resource ID (polymorphic)
  author: {                   // Nested object
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;            // Comment content
  rating?: number;            // Optional rating (1-5)
  parentId?: string;          // For threaded comments
  isApproved: boolean;        // Moderation status
  isReported: boolean;        // Report flag
  reportReason?: string;      // Report reason
  moderatedBy?: string;       // Moderator ID
  moderatedAt?: string;       // Moderation timestamp
  likes: number;              // Like count
  dislikes: number;           // Dislike count
  replies: string[];          // Reply comment IDs
  metadata: {                 // Additional metadata
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  };
  createdAt: string;          // ISO timestamp
  updatedAt: string;          // ISO timestamp
}
```

## Lambda Functions Overview

The SAM template defines 20+ Lambda functions for complete CRUD operations:

### Destination Functions
- `GetAllDestinations` - GET /destinations
- `GetDestinationById` - GET /destinations/{id}
- `CreateDestination` - POST /destinations (Admin only)
- `UpdateDestination` - PUT /destinations/{id} (Admin only)
- `DeleteDestination` - DELETE /destinations/{id} (Admin only)
- `SearchDestinations` - GET /destinations/search

### Tour Functions
- `GetAllTours` - GET /tours
- `GetTourById` - GET /tours/{id}
- `GetToursByDestination` - GET /destinations/{id}/tours
- `CreateTour` - POST /tours (Admin only)
- `UpdateTour` - PUT /tours/{id} (Admin only)
- `DeleteTour` - DELETE /tours/{id} (Admin only)

### Blog Functions
- `GetAllBlogs` - GET /blogs
- `GetBlogById` - GET /blogs/{id}
- `GetBlogBySlug` - GET /blogs/slug/{slug}
- `CreateBlog` - POST /blogs (Editor/Admin)
- `UpdateBlog` - PUT /blogs/{id} (Editor/Admin)
- `DeleteBlog` - DELETE /blogs/{id} (Admin only)

### Comment Functions
- `GetCommentsByResource` - GET /comments
- `CreateComment` - POST /comments
- `UpdateComment` - PUT /comments/{id}
- `DeleteComment` - DELETE /comments/{id}
- `ModerateComment` - PUT /comments/{id}/moderate (Moderator/Admin)

## Security and Authentication

### Cognito User Pool Setup
The SAM template creates:
- User Pool with email verification
- User Pool Client for authentication
- User Groups for role-based access:
  - `admin` - Full system access
  - `moderator` - Comment moderation
  - `editor` - Content creation
  - Regular users (implicit)

### API Gateway Authorization
- Protected endpoints require Cognito JWT tokens
- Public endpoints (read-only) allow anonymous access
- Role-based permissions enforced in Lambda functions

## Environment Variables

The Lambda functions use these environment variables:
```bash
NODE_ENV=production
DESTINATIONS_TABLE=<stack-name>-destinations
TOURS_TABLE=<stack-name>-tours
BLOGS_TABLE=<stack-name>-blogs
COMMENTS_TABLE=<stack-name>-comments
```

## Cost Optimization

### DynamoDB
- **Pay-per-request billing** for variable workloads
- **Global Secondary Indexes** for efficient queries
- **Item-level TTL** for automatic cleanup (if needed)

### Lambda
- **512MB memory allocation** balances performance and cost
- **30-second timeout** prevents runaway functions
- **X-Ray tracing enabled** for debugging

## Testing the Deployment

### 1. Test Public Endpoints
```bash
# Get all destinations
curl https://your-api-id.execute-api.region.amazonaws.com/dev/destinations

# Get specific destination
curl https://your-api-id.execute-api.region.amazonaws.com/dev/destinations/dest-123
```

### 2. Test Protected Endpoints
```bash
# Create destination (requires authentication)
curl -X POST https://your-api-id.execute-api.region.amazonaws.com/dev/destinations \
  -H "Authorization: Bearer <cognito-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Destination","region":"Europe","category":"Adventure"}'
```

## Troubleshooting

### Common Issues

1. **Table Already Exists**
   ```bash
   # Delete existing table
   aws dynamodb delete-table --table-name travelquest-destinations
   ```

2. **Insufficient Permissions**
   - Ensure AWS credentials have DynamoDB, Lambda, API Gateway, and Cognito permissions

3. **Lambda Function Errors**
   ```bash
   # Check function logs
   aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/"
   ```

4. **API Gateway CORS Issues**
   - Verify CORS configuration in template.yaml
   - Test with browser developer tools

### Cleanup Resources

To delete all AWS resources:
```bash
# Delete the CloudFormation stack
aws cloudformation delete-stack --stack-name travelquest-backend

# Confirm deletion
aws cloudformation wait stack-delete-complete --stack-name travelquest-backend
```

## Next Steps

1. **Frontend Integration**: Update frontend API calls to use the deployed API Gateway URLs
2. **Custom Domain**: Configure a custom domain name for the API
3. **Monitoring**: Set up CloudWatch dashboards and alarms
4. **CI/CD Pipeline**: Implement automated deployment with GitHub Actions
5. **Data Population**: Add seed data to the DynamoDB tables
6. **Performance Testing**: Load test the API endpoints

## Support

For deployment issues:
1. Check AWS CloudFormation events in the AWS Console
2. Review Lambda function logs in CloudWatch
3. Verify IAM permissions and policies
4. Test DynamoDB table access permissions

---

**Note**: This deployment guide is optimized for AWS Academy environments and follows serverless best practices for cost-effectiveness and scalability.
