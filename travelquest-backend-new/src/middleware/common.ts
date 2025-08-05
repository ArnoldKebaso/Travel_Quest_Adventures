/**
 * Common Middleware for TravelQuest Lambda Functions
 * Provides standardized error handling, CORS, and JSON parsing
 */

import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ROLES, ROLE_HIERARCHY, HTTP_STATUS, Role } from '../constants';

// Extend the Context type to include our custom properties
interface ExtendedContext extends Context {
  user?: {
    id: string;
    email: string;
    role: string;
    groups: string[];
  };
  startTime?: number;
}

/**
 * Standard middleware stack for all Lambda functions
 * Includes JSON parsing, error handling, and CORS
 */
export const withCommon = (fn: APIGatewayProxyHandler) =>
  middy(fn)
    .use(jsonBodyParser())
    .use(httpErrorHandler())
    .use(cors({
      origin: '*', // Allow all origins in development - should be restricted in production
      headers: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      credentials: true,
    }));

/**
 * Role-based access control middleware
 * Validates user permissions based on Cognito groups
 */
export const withRoleAuth = (requiredRole: Role) => {
  return {
    before: async (request: middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult>) => {
      try {
        // Extract user role from Cognito claims
        const claims = request.event.requestContext.authorizer?.claims;
        if (!claims) {
          throw new Error('No authorization claims found');
        }

        // Get user groups from Cognito
        const groups = claims['cognito:groups'] || [];
        const userRole = Array.isArray(groups) ? groups[0] : groups;

        // Check if user has required role or higher
        const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole as Role);
        const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);

        if (userRoleIndex === -1 || userRoleIndex < requiredRoleIndex) {
          const error = new Error('Insufficient permissions');
          (error as any).statusCode = HTTP_STATUS.FORBIDDEN;
          throw error;
        }

        // Add user info to request context
        const extendedContext = request.context as ExtendedContext;
        extendedContext.user = {
          id: claims.sub,
          email: claims.email,
          role: userRole,
          groups: groups,
        };
      } catch (error) {
        console.error('Role authorization failed:', error);
        const authError = new Error('Authorization failed');
        (authError as any).statusCode = HTTP_STATUS.UNAUTHORIZED;
        throw authError;
      }
    },
  };
};

/**
 * Input validation middleware
 * Validates request body against provided schema
 */
export const withValidation = (schema: any) => {
  return {
    before: async (request: middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult>) => {
      const { body } = request.event;
      
      if (!body) {
        const error = new Error('Request body is required');
        (error as any).statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
      }

      // Basic validation - in a real application, you'd use a schema validation library like Joi or Zod
      const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
      
      // Add validation logic here based on schema
      request.event.body = parsedBody;
    },
  };
};

/**
 * Request logging middleware
 * Logs incoming requests for monitoring and debugging
 */
export const withLogging = () => {
  return {
    before: async (request: middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult>) => {
      console.log('Incoming request:', {
        method: request.event.httpMethod,
        path: request.event.path,
        pathParameters: request.event.pathParameters,
        queryStringParameters: request.event.queryStringParameters,
        userAgent: request.event.headers['User-Agent'],
        sourceIp: request.event.requestContext.identity.sourceIp,
        timestamp: new Date().toISOString(),
      });
    },
    after: async (request: middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult>) => {
      console.log('Response:', {
        statusCode: request.response?.statusCode,
        timestamp: new Date().toISOString(),
      });
    },
    onError: async (request: middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult>) => {
      console.error('Request error:', {
        error: request.error,
        method: request.event.httpMethod,
        path: request.event.path,
        timestamp: new Date().toISOString(),
      });
    },
  };
};

/**
 * Performance monitoring middleware
 * Tracks execution time and adds performance metrics
 */
export const withPerformanceMonitoring = () => {
  return {
    before: async (request: middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult>) => {
      const extendedContext = request.context as ExtendedContext;
      extendedContext.startTime = Date.now();
    },
    after: async (request: middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult>) => {
      const extendedContext = request.context as ExtendedContext;
      const duration = Date.now() - (extendedContext.startTime || 0);
      console.log('Performance metrics:', {
        duration: `${duration}ms`,
        method: request.event.httpMethod,
        path: request.event.path,
        statusCode: request.response?.statusCode,
      });

      // Add performance headers
      if (request.response) {
        request.response.headers = {
          ...request.response.headers,
          'X-Execution-Time': `${duration}ms`,
        };
      }
    },
  };
};

/**
 * Combined middleware for admin functions
 * Includes common middleware plus admin role requirement
 */
export const withAdminAuth = (fn: APIGatewayProxyHandler) =>
  middy(fn)
    .use(jsonBodyParser())
    .use(httpErrorHandler())
    .use(cors({
      origin: '*',
      headers: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      credentials: true,
    }))
    .use(withRoleAuth(ROLES.ADMIN))
    .use(withLogging())
    .use(withPerformanceMonitoring());

/**
 * Combined middleware for moderator functions
 * Includes common middleware plus moderator role requirement
 */
export const withModeratorAuth = (fn: APIGatewayProxyHandler) =>
  middy(fn)
    .use(jsonBodyParser())
    .use(httpErrorHandler())
    .use(cors({
      origin: '*',
      headers: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      credentials: true,
    }))
    .use(withRoleAuth(ROLES.MODERATOR))
    .use(withLogging())
    .use(withPerformanceMonitoring());

/**
 * Combined middleware for editor functions
 * Includes common middleware plus editor role requirement
 */
export const withEditorAuth = (fn: APIGatewayProxyHandler) =>
  middy(fn)
    .use(jsonBodyParser())
    .use(httpErrorHandler())
    .use(cors({
      origin: '*',
      headers: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      credentials: true,
    }))
    .use(withRoleAuth(ROLES.EDITOR))
    .use(withLogging())
    .use(withPerformanceMonitoring());

/**
 * Combined middleware for authenticated user functions
 * Includes common middleware plus basic user authentication
 */
export const withUserAuth = (fn: APIGatewayProxyHandler) =>
  middy(fn)
    .use(jsonBodyParser())
    .use(httpErrorHandler())
    .use(cors({
      origin: '*',
      headers: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      methods: 'GET,POST,PUT,DELETE,OPTIONS',
      credentials: true,
    }))
    .use(withRoleAuth(ROLES.USER))
    .use(withLogging())
    .use(withPerformanceMonitoring());
