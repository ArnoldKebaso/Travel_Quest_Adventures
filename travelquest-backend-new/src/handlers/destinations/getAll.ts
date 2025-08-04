import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../../utils/dynamo";
import { ok, fail } from "../../utils/responses";
import { withMiddlewares } from "../../middleware/auth";

export const handler: APIGatewayProxyHandlerV2 = withMiddlewares(async (event) => {
  try {
    const { region, category } = event.queryStringParameters || {};
    const params: any = {
      TableName: process.env.TABLE_NAME!,
      FilterExpression: "#et = :dest",
      ExpressionAttributeNames: { "#et": "entityType" },
      ExpressionAttributeValues: { ":dest": "DESTINATION" }
    };
    if (region) { params.FilterExpression += " AND #r = :r"; params.ExpressionAttributeNames!["#r"] = "region"; params.ExpressionAttributeValues![":r"] = region; }
    if (category) { params.FilterExpression += " AND contains(#c,:c)"; params.ExpressionAttributeNames!["#c"] = "category"; params.ExpressionAttributeValues![":c"] = category; }
    const data = await ddb.send(new ScanCommand(params));
    return ok(data.Items);
  } catch (err) { console.error(err); return fail(); }
});