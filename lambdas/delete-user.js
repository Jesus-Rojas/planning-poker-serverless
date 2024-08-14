import { responseDefault } from "../constants/response-default.js";
import { deleteUser, getUserById } from "../shared/dynamo-client.js";
import { handleError } from "../shared/handle-error.js";

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

    await deleteUser(userId);
    
    return {
      ...responseDefault,
      statusCode: 204,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return handleError(error);
  }
}
