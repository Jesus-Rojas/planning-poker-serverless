import { StatusCodes } from "http-status-codes";
import { responseDefault } from "../constants/response-default.js";
import { deleteUser, getUserById } from "../shared/dynamo-client.js";
import { handleError } from "../shared/handle-error.js";

const handleErrorCustom = () => ({
  ...responseDefault,
  statusCode: StatusCodes.NOT_FOUND,
  body: JSON.stringify({ error: "User not found" }),
});

export const handler = async (event) => {
  try {
    const userId = event.pathParameters.id;
    if (!userId) return handleErrorCustom();
    const user = await getUserById(userId);
    if (!user) return handleErrorCustom();
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
