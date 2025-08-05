// Test setup file for Jest
// This file runs before each test to set up the environment

// Mock environment variables
process.env.DESTINATIONS_TABLE = 'test-destinations-table';
process.env.TOURS_TABLE = 'test-tours-table';
process.env.COMMENTS_TABLE = 'test-comments-table';
process.env.BLOGS_TABLE = 'test-blogs-table';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.AWS_REGION = 'us-east-1';

// Mock AWS DynamoDB client before any imports
const mockSend = jest.fn();

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({
    send: mockSend
  }))
}));

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockReturnValue({
      send: mockSend
    })
  },
  ScanCommand: jest.fn(),
  GetCommand: jest.fn(),
  PutCommand: jest.fn(),
  UpdateCommand: jest.fn(),
  DeleteCommand: jest.fn(),
  QueryCommand: jest.fn(),
}));

// Export the mock send function for use in tests
(global as any).mockDynamoDBSend = mockSend;
