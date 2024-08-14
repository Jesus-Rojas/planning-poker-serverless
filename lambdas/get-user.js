import { handleError } from "../shared/handle-error.js";
import { getUserById } from "../shared/dynamo-client.js";
import { responseDefault } from "../constants/response-default.js";
import { StatusCodes } from "http-status-codes";

export const handler = async (event) => {
  try {
    const userId = event.pathParameters.id;
    const user = await getUserById(userId);
    
    if (!user) {
      return {
        ...responseDefault,
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    return {
      ...responseDefault,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return handleError(error);
  }
};
