import { handleError } from "../shared/handle-error.js";
import { getUserById } from "../shared/dynamo-client.js";
import { responseDefault } from "../constants/response-default.js";

export const handler = async (event) => {
  try {
    const userId = event.pathParameters.id;
    const user = await getUserById(userId);
    
    if (!user) {
      return {
        ...responseDefault,
        statusCode: 404,
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
