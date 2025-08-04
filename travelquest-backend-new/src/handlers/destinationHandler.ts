import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Destination } from '../models';
import { createResponse, validateRequired } from '../utils/apiUtils';
import { sanitizeDestinationInput, validateAndSanitizeInput } from '../utils/sanitization';
import { withCommon } from '../middleware/common';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env['DESTINATIONS_TABLE']!;

export const getAllDestinations = withCommon(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      console.log('Getting all destinations');
      
      const queryParams = event.queryStringParameters || {};
      const { region, category, price_min, price_max, nextToken, limit = '20' } = queryParams;
      
      const maxLimit = Math.min(parseInt(limit), 100); // Cap at 100 items
      
      let result;
      
      // If region and category are provided, use GSI for efficient querying
      if (region && category) {
        const queryCommand = new QueryCommand({
          TableName: tableName,
          IndexName: 'region-category-index',
          KeyConditionExpression: '#region = :region AND #category = :category',
          ExpressionAttributeNames: {
            '#region': 'region',
            '#category': 'category'
          },
          ExpressionAttributeValues: {
            ':region': region,
            ':category': category
          },
          Limit: maxLimit,
          ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString()) : undefined
        });
        
        result = await docClient.send(queryCommand);
      } else if (region) {
        // Query by region only
        const queryCommand = new QueryCommand({
          TableName: tableName,
          IndexName: 'region-category-index',
          KeyConditionExpression: '#region = :region',
          ExpressionAttributeNames: {
            '#region': 'region'
          },
          ExpressionAttributeValues: {
            ':region': region
          },
          Limit: maxLimit,
          ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString()) : undefined
        });
        
        result = await docClient.send(queryCommand);
      } else {
        // Fallback to scan when no GSI filters are provided
        const scanCommand = new ScanCommand({
          TableName: tableName,
          Limit: maxLimit,
          ExclusiveStartKey: nextToken ? JSON.parse(Buffer.from(nextToken, 'base64').toString()) : undefined
        });
        
        result = await docClient.send(scanCommand);
      }
      
      let destinations = result.Items as Destination[];
      
      // Apply additional filters that can't be done at the DynamoDB level
      if (price_min || price_max) {
        destinations = destinations.filter(dest => {
          const price = dest.price || 0;
          if (price_min && price < parseFloat(price_min)) return false;
          if (price_max && price > parseFloat(price_max)) return false;
          return true;
        });
      }
      
      // Prepare response with pagination
      const response: any = {
        destinations: destinations || [],
        count: destinations?.length || 0
      };
      
      // Add nextToken if there are more results
      if (result.LastEvaluatedKey) {
        response.nextToken = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64');
      }

      return createResponse(200, response, 'Destinations retrieved successfully');
    } catch (error) {
      console.error('Error getting destinations:', error);
      return createResponse(500, null, 'Failed to retrieve destinations');
    }
  }
);

export const getDestinationById = withCommon(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const { id } = event.pathParameters || {};
      
      if (!id) {
        return createResponse(400, null, 'Destination ID is required');
      }

      console.log(`Getting destination with ID: ${id}`);

      const command = new GetCommand({
        TableName: tableName,
        Key: { id },
      });

      const result = await docClient.send(command);
      
      if (!result.Item) {
        return createResponse(404, null, 'Destination not found');
      }

      const destination = result.Item as Destination;
      return createResponse<Destination>(200, destination, 'Destination retrieved successfully');
    } catch (error) {
      console.error('Error getting destination:', error);
      return createResponse(500, null, 'Failed to retrieve destination');
    }
  }
);

export const createDestination = withCommon(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      if (!event.body) {
        return createResponse(400, null, 'Request body is required');
      }

      const body = JSON.parse(event.body);
      
      // Validate required fields
      const requiredFields = ['name', 'description', 'region', 'country', 'price'];
      const validation = validateRequired(body, requiredFields);
      if (!validation.isValid) {
        return createResponse(400, null, `Missing required fields: ${validation.missing.join(', ')}`);
      }

      // Sanitize input to prevent XSS attacks
      const sanitizedInput = sanitizeDestinationInput(body);

      const destination: Destination = {
        id: uuidv4(),
        name: sanitizedInput.name,
        description: sanitizedInput.description,
        region: sanitizedInput.region,
        country: sanitizedInput.country,
        price: parseFloat(sanitizedInput.price),
        image: sanitizedInput.image || '',
        category: sanitizedInput.category || 'adventure',
        rating: sanitizedInput.rating || 0,
        reviewCount: sanitizedInput.reviewCount || 0,
        highlights: sanitizedInput.highlights || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Creating destination:', destination);

      const command = new PutCommand({
        TableName: tableName,
        Item: destination,
      });

      await docClient.send(command);

      return createResponse<Destination>(201, destination, 'Destination created successfully');
    } catch (error) {
      console.error('Error creating destination:', error);
      return createResponse(500, null, 'Failed to create destination');
    }
  }
);

export const updateDestination = withCommon(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const { id } = event.pathParameters || {};
      
      if (!id) {
        return createResponse(400, null, 'Destination ID is required');
      }

      if (!event.body) {
        return createResponse(400, null, 'Request body is required');
      }

      const body = JSON.parse(event.body);
      
      console.log(`Updating destination with ID: ${id}`);

      // Check if destination exists
      const getCommand = new GetCommand({
        TableName: tableName,
        Key: { id },
      });

      const existingResult = await docClient.send(getCommand);
      if (!existingResult.Item) {
        return createResponse(404, null, 'Destination not found');
      }

      // Build update expression
      const updateExpression = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, unknown> = {};

      const updatableFields = ['name', 'description', 'region', 'country', 'price', 'image', 'category', 'rating', 'reviewCount', 'highlights'];
      
      for (const field of updatableFields) {
        if (body[field] !== undefined) {
          updateExpression.push(`#${field} = :${field}`);
          expressionAttributeNames[`#${field}`] = field;
          expressionAttributeValues[`:${field}`] = field === 'price' ? parseFloat(body[field]) : body[field];
        }
      }

      if (updateExpression.length === 0) {
        return createResponse(400, null, 'No valid fields to update');
      }

      // Always update the updatedAt field
      updateExpression.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();

      const updateCommand = new UpdateCommand({
        TableName: tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      });

      const result = await docClient.send(updateCommand);
      const updatedDestination = result.Attributes as Destination;

      return createResponse<Destination>(200, updatedDestination, 'Destination updated successfully');
    } catch (error) {
      console.error('Error updating destination:', error);
      return createResponse(500, null, 'Failed to update destination');
    }
  }
);

export const deleteDestination = withCommon(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const { id } = event.pathParameters || {};
      
      if (!id) {
        return createResponse(400, null, 'Destination ID is required');
      }

      console.log(`Deleting destination with ID: ${id}`);

      // Check if destination exists
      const getCommand = new GetCommand({
        TableName: tableName,
        Key: { id },
      });

      const existingResult = await docClient.send(getCommand);
      if (!existingResult.Item) {
        return createResponse(404, null, 'Destination not found');
      }

      const deleteCommand = new DeleteCommand({
        TableName: tableName,
        Key: { id },
      });

      await docClient.send(deleteCommand);

      return createResponse(200, null, 'Destination deleted successfully');
    } catch (error) {
      console.error('Error deleting destination:', error);
      return createResponse(500, null, 'Failed to delete destination');
    }
  }
);
