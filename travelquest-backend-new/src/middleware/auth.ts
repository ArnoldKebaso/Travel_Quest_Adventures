//  /middleware/auth.ts:
import middy from "@middy/core";
import jsonBody from "@middy/http-json-body-parser";
import errors from "@middy/http-error-handler";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import jwt from "jsonwebtoken";
import { unauth } from "../utils/responses";

// Wrap handler with JSON parser, CORS, error handler, & (optional) Cognito JWT verify
export const withMiddlewares = (handler: APIGatewayProxyHandlerV2, requireAuth = false): any => {
  return middy(handler)
    .use(jsonBody())
    .use(errors())
    .use({
      before: async (request) => {
        request.response = request.response || {};
        if (requireAuth) {
          const token = request.event.headers?.authorization?.split(" ")[1];
          try {
            request.event.user = jwt.decode(token) as any;   // Cognito verifies at API GW; decode for role
          } catch (e) { throw unauth(); }
        }
      },
      after: async (request) => {
        request.response.headers = {
          ...(request.response.headers || {}),
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        };
      }
    });
};