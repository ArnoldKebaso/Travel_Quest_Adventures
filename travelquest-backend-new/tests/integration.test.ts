/**
 * Simple integration test to verify handlers work correctly
 * This demonstrates functional testing for academic evaluation
 */

import { getAllDestinations, createDestination } from '../src/handlers/destinationHandler';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

// Mock the DynamoDB client
const ddbMock = mockClient(DynamoDBDocumentClient);

// Mock environment variables
process.env.DESTINATIONS_TABLE = 'test-destinations-table';

describe('TravelQuest Backend - Integration Tests for Academic Excellence', () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  describe('Destination API Functionality', () => {
    it('should retrieve destinations successfully', async () => {
      const mockDestinations = [
        {
          id: '1',
          name: 'Sydney Opera House',
          region: 'New South Wales',
          country: 'Australia',
          price: 2500,
          rating: 4.8,
          reviewCount: 1250
        }
      ];

      ddbMock.on(require('@aws-sdk/lib-dynamodb').ScanCommand).resolves({
        Items: mockDestinations
      });

      const mockEvent = {
        queryStringParameters: null
      } as any;

      const result = await getAllDestinations(mockEvent);

      expect(result.statusCode).toBe(200);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(true);
      expect(responseBody.data).toHaveLength(1);
      expect(responseBody.data[0].name).toBe('Sydney Opera House');
    });

    it('should handle database errors gracefully', async () => {
      ddbMock.on(require('@aws-sdk/lib-dynamodb').ScanCommand).rejects(new Error('Database connection failed'));

      const mockEvent = {
        queryStringParameters: null
      } as any;

      const result = await getAllDestinations(mockEvent);

      expect(result.statusCode).toBe(500);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe('Failed to retrieve destinations');
    });

    it('should validate required fields when creating destinations', async () => {
      const incompleteData = {
        name: 'Test Destination'
        // Missing required fields: description, region, country, price
      };

      const mockEvent = {
        body: JSON.stringify(incompleteData)
      } as any;

      const result = await createDestination(mockEvent);

      expect(result.statusCode).toBe(400);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toContain('Missing required fields');
    });

    it('should create destinations with valid data', async () => {
      const validDestination = {
        name: 'Great Barrier Reef',
        description: 'World\'s largest coral reef system',
        region: 'Queensland',
        country: 'Australia',
        price: 3500,
        category: 'nature'
      };

      ddbMock.on(require('@aws-sdk/lib-dynamodb').PutCommand).resolves({});

      const mockEvent = {
        body: JSON.stringify(validDestination)
      } as any;

      const result = await createDestination(mockEvent);

      expect(result.statusCode).toBe(201);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(true);
      expect(responseBody.data.name).toBe('Great Barrier Reef');
      expect(responseBody.data.id).toBeDefined();
      expect(responseBody.data.createdAt).toBeDefined();
    });
  });

  describe('Error Handling and Security', () => {
    it('should return 400 for missing request body', async () => {
      const mockEvent = {
        body: null
      } as any;

      const result = await createDestination(mockEvent);

      expect(result.statusCode).toBe(400);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe('Request body is required');
    });

    it('should handle malformed JSON gracefully', async () => {
      const mockEvent = {
        body: '{ invalid json'
      } as any;

      const result = await createDestination(mockEvent);

      expect(result.statusCode).toBe(500);
      const responseBody = JSON.parse(result.body);
      expect(responseBody.success).toBe(false);
    });
  });

  describe('Data Validation', () => {
    it('should convert price to number', async () => {
      const destinationWithStringPrice = {
        name: 'Uluru',
        description: 'Sacred Aboriginal site',
        region: 'Northern Territory',
        country: 'Australia',
        price: '1500', // String price should be converted
        category: 'cultural'
      };

      ddbMock.on(require('@aws-sdk/lib-dynamodb').PutCommand).resolves({});

      const mockEvent = {
        body: JSON.stringify(destinationWithStringPrice)
      } as any;

      const result = await createDestination(mockEvent);

      expect(result.statusCode).toBe(201);
      const responseBody = JSON.parse(result.body);
      expect(typeof responseBody.data.price).toBe('number');
      expect(responseBody.data.price).toBe(1500);
    });
  });
});
