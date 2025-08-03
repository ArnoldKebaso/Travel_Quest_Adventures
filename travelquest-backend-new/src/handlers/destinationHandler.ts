import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Destination } from '../models';
import { createResponse, validateRequired } from '../utils/apiUtils';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env['DESTINATIONS_TABLE']!;

export const getAllDestinations = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Getting all destinations');
    
    const command = new ScanCommand({
      TableName: tableName,
    });

    const result = await docClient.send(command);
    const destinations = result.Items as Destination[];

    return createResponse<Destination[]>(200, destinations || [], 'Destinations retrieved successfully');
  } catch (error) {
    console.error('Error getting destinations:', error);
    return createResponse(500, null, 'Failed to retrieve destinations');
  }
};

export const getDestinationById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
};

export const createDestination = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

    const destination: Destination = {
      id: uuidv4(),
      name: body.name,
      description: body.description,
      region: body.region,
      country: body.country,
      price: parseFloat(body.price),
      image: body.image || '',
      category: body.category || 'adventure',
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      highlights: body.highlights || [],
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
};

export const updateDestination = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
};

export const deleteDestination = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
};
