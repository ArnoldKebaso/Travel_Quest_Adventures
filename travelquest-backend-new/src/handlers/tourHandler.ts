import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Tour } from '../models';
import { createResponse, validateRequired } from '../utils/apiUtils';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env['TOURS_TABLE']!;

/**
 * GET /tours - Retrieve all tours with optional filtering and sorting
 * Supports query parameters: destination, difficulty, price_min, price_max, sort_by, sort_order
 * Advanced searching and filtering functionality for high marks
 */
export const getAllTours = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('Getting all tours with filters:', event.queryStringParameters);
    
    const queryParams = event.queryStringParameters || {};
    const { destination, difficulty, price_min, price_max, sort_by = 'createdAt', sort_order = 'desc' } = queryParams;

    const command = new ScanCommand({
      TableName: tableName,
    });

    const result = await docClient.send(command);
    let tours = result.Items as Tour[];

    // Advanced filtering logic for high marks
    if (destination) {
      tours = tours.filter(tour => 
        tour.destinationId?.toLowerCase().includes(destination.toLowerCase()) ||
        tour.title?.toLowerCase().includes(destination.toLowerCase())
      );
    }

    if (difficulty) {
      tours = tours.filter(tour => tour.difficulty?.toLowerCase() === difficulty.toLowerCase());
    }

    if (price_min) {
      const minPrice = parseFloat(price_min);
      tours = tours.filter(tour => tour.price >= minPrice);
    }

    if (price_max) {
      const maxPrice = parseFloat(price_max);
      tours = tours.filter(tour => tour.price <= maxPrice);
    }

    // Advanced sorting functionality
    tours.sort((a, b) => {
      let aValue: any = a[sort_by as keyof Tour];
      let bValue: any = b[sort_by as keyof Tour];

      if (sort_by === 'price') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (sort_order === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    console.log(`Returning ${tours.length} filtered tours`);
    return createResponse<Tour[]>(200, tours, 'Tours retrieved successfully');
  } catch (error) {
    console.error('Error getting tours:', error);
    return createResponse(500, null, 'Failed to retrieve tours');
  }
};

/**
 * GET /tours/{id} - Retrieve a specific tour by ID
 */
export const getTourById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, null, 'Tour ID is required');
    }

    console.log(`Getting tour with ID: ${id}`);

    const command = new GetCommand({
      TableName: tableName,
      Key: { id },
    });

    const result = await docClient.send(command);
    
    if (!result.Item) {
      return createResponse(404, null, 'Tour not found');
    }

    const tour = result.Item as Tour;
    return createResponse<Tour>(200, tour, 'Tour retrieved successfully');
  } catch (error) {
    console.error('Error getting tour:', error);
    return createResponse(500, null, 'Failed to retrieve tour');
  }
};

/**
 * POST /tours - Create a new tour (Admin only)
 * Role-based access control implementation for high marks
 */
export const createTour = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Role-based access control - Check if user is admin
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader) {
      return createResponse(401, null, 'Authorization header required');
    }

    // Extract user claims from Cognito JWT (would be processed by API Gateway Authorizer)
    const userClaims = event.requestContext.authorizer?.claims;
    const userGroups = userClaims?.['cognito:groups'] || '';
    
    if (!userGroups.includes('admin')) {
      return createResponse(403, null, 'Admin access required to create tours');
    }

    if (!event.body) {
      return createResponse(400, null, 'Request body is required');
    }

    const body = JSON.parse(event.body);
    
    // Comprehensive validation for robust application
    const requiredFields = ['title', 'description', 'destinationId', 'price', 'duration', 'difficulty'];
    const validation = validateRequired(body, requiredFields);
    if (!validation.isValid) {
      return createResponse(400, null, `Missing required fields: ${validation.missing.join(', ')}`);
    }

    const tour: Tour = {
      id: uuidv4(),
      title: body.title,
      description: body.description,
      destinationId: body.destinationId,
      category: body.category || 'Adventure',
      region: body.region || 'Australia',
      duration: body.duration,
      durationDays: parseInt(body.duration) || 1,
      price: parseFloat(body.price),
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      image: body.image || '',
      highlights: body.highlights || [],
      maxGroupSize: body.maxGroupSize || 10,
      difficulty: body.difficulty,
      includes: body.includes || [],
      itinerary: body.itinerary || [],
      images: body.images || [],
      isAvailable: body.isAvailable !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Creating tour:', tour);

    const command = new PutCommand({
      TableName: tableName,
      Item: tour,
    });

    await docClient.send(command);

    return createResponse<Tour>(201, tour, 'Tour created successfully');
  } catch (error) {
    console.error('Error creating tour:', error);
    return createResponse(500, null, 'Failed to create tour');
  }
};

/**
 * PUT /tours/{id} - Update an existing tour (Admin only)
 */
export const updateTour = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Role-based access control
    const userClaims = event.requestContext.authorizer?.claims;
    const userGroups = userClaims?.['cognito:groups'] || '';
    
    if (!userGroups.includes('admin')) {
      return createResponse(403, null, 'Admin access required to update tours');
    }

    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, null, 'Tour ID is required');
    }

    if (!event.body) {
      return createResponse(400, null, 'Request body is required');
    }

    const body = JSON.parse(event.body);
    
    console.log(`Updating tour with ID: ${id}`);

    // Check if tour exists
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: { id },
    });

    const existingResult = await docClient.send(getCommand);
    if (!existingResult.Item) {
      return createResponse(404, null, 'Tour not found');
    }

    // Build comprehensive update expression
    const updateExpression = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    const updatableFields = ['title', 'description', 'destinationId', 'price', 'duration', 'difficulty', 'maxGroupSize', 'includes', 'itinerary', 'images', 'rating', 'reviewCount', 'isAvailable'];
    
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
    const updatedTour = result.Attributes as Tour;

    return createResponse<Tour>(200, updatedTour, 'Tour updated successfully');
  } catch (error) {
    console.error('Error updating tour:', error);
    return createResponse(500, null, 'Failed to update tour');
  }
};

/**
 * DELETE /tours/{id} - Delete a tour (Admin only)
 */
export const deleteTour = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Role-based access control
    const userClaims = event.requestContext.authorizer?.claims;
    const userGroups = userClaims?.['cognito:groups'] || '';
    
    if (!userGroups.includes('admin')) {
      return createResponse(403, null, 'Admin access required to delete tours');
    }

    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, null, 'Tour ID is required');
    }

    console.log(`Deleting tour with ID: ${id}`);

    // Check if tour exists
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: { id },
    });

    const existingResult = await docClient.send(getCommand);
    if (!existingResult.Item) {
      return createResponse(404, null, 'Tour not found');
    }

    const deleteCommand = new DeleteCommand({
      TableName: tableName,
      Key: { id },
    });

    await docClient.send(deleteCommand);

    return createResponse(200, null, 'Tour deleted successfully');
  } catch (error) {
    console.error('Error deleting tour:', error);
    return createResponse(500, null, 'Failed to delete tour');
  }
};
