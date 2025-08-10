const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

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

exports.getAllDestinations = async (event) => {
    try {
        console.log('Getting all destinations');
        
        const tableName = process.env.DESTINATIONS_TABLE;
        console.log('Table name:', tableName);

        const scanCommand = new ScanCommand({
            TableName: tableName,
            Limit: 50
        });

        const result = await docClient.send(scanCommand);
        console.log('Scan result:', result);

        return createResponse(200, {
            destinations: result.Items || [],
            count: result.Items?.length || 0
        });

    } catch (error) {
        console.error('Error getting destinations:', error);
        return createResponse(500, null, `Internal server error: ${error.message}`);
    }
};
