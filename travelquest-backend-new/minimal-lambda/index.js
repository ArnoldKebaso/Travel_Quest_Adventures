const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Simple API response helper
const createResponse = (statusCode, data, message = null) => {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
        body: JSON.stringify({
            success: statusCode < 400,
            data,
            message,
            timestamp: new Date().toISOString()
        })
    };
};

// Destinations handlers
exports.getAllDestinations = async (event) => {
    try {
        const result = await docClient.send(new ScanCommand({
            TableName: process.env.DESTINATIONS_TABLE,
            Limit: 50
        }));

        return createResponse(200, {
            destinations: result.Items || [],
            count: result.Items?.length || 0
        });
    } catch (error) {
        console.error('Error:', error);
        return createResponse(500, null, `Error: ${error.message}`);
    }
};

exports.getDestinationById = async (event) => {
    try {
        const id = event.pathParameters?.id;
        if (!id) {
            return createResponse(400, null, 'Missing destination ID');
        }

        const result = await docClient.send(new GetCommand({
            TableName: process.env.DESTINATIONS_TABLE,
            Key: { id }
        }));

        if (!result.Item) {
            return createResponse(404, null, 'Destination not found');
        }

        return createResponse(200, { destination: result.Item });
    } catch (error) {
        console.error('Error:', error);
        return createResponse(500, null, `Error: ${error.message}`);
    }
};

// Tours handlers
exports.getAllTours = async (event) => {
    try {
        const result = await docClient.send(new ScanCommand({
            TableName: process.env.TOURS_TABLE,
            Limit: 50
        }));

        return createResponse(200, {
            tours: result.Items || [],
            count: result.Items?.length || 0
        });
    } catch (error) {
        console.error('Error:', error);
        return createResponse(500, null, `Error: ${error.message}`);
    }
};

exports.getTourById = async (event) => {
    try {
        const id = event.pathParameters?.id;
        if (!id) {
            return createResponse(400, null, 'Missing tour ID');
        }

        const result = await docClient.send(new GetCommand({
            TableName: process.env.TOURS_TABLE,
            Key: { id }
        }));

        if (!result.Item) {
            return createResponse(404, null, 'Tour not found');
        }

        return createResponse(200, { tour: result.Item });
    } catch (error) {
        console.error('Error:', error);
        return createResponse(500, null, `Error: ${error.message}`);
    }
};

// Blogs handlers
exports.getAllBlogs = async (event) => {
    try {
        const result = await docClient.send(new ScanCommand({
            TableName: process.env.BLOGS_TABLE,
            Limit: 50
        }));

        return createResponse(200, {
            blogs: result.Items || [],
            count: result.Items?.length || 0
        });
    } catch (error) {
        console.error('Error:', error);
        return createResponse(500, null, `Error: ${error.message}`);
    }
};

exports.getBlogById = async (event) => {
    try {
        const id = event.pathParameters?.id;
        if (!id) {
            return createResponse(400, null, 'Missing blog ID');
        }

        const result = await docClient.send(new GetCommand({
            TableName: process.env.BLOGS_TABLE,
            Key: { id }
        }));

        if (!result.Item) {
            return createResponse(404, null, 'Blog not found');
        }

        return createResponse(200, { blog: result.Item });
    } catch (error) {
        console.error('Error:', error);
        return createResponse(500, null, `Error: ${error.message}`);
    }
};
