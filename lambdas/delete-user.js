import { StatusCodes } from "http-status-codes";
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
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    await deleteUser(userId);
    
    return {
      ...responseDefault,
      statusCode: StatusCodes.NO_CONTENT,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return handleError(error);
  }
}
