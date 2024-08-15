import { handleError } from "../shared/handle-error.js";
import { getUserById } from "../shared/dynamo-client.js";
import { responseDefault } from "../constants/response-default.js";
import { StatusCodes } from "http-status-codes";

const handleErrorCustom = () => ({
  ...responseDefault,
  statusCode: StatusCodes.NOT_FOUND,
  body: JSON.stringify({ error: "User not found" }),
});

export const handler = async (event) => {
  const userId = event.pathParameters.id;
  if (!userId) return handleErrorCustom();
  try {
    const user = await getUserById(userId);
    if (!user) return handleErrorCustom();
    return {
      ...responseDefault,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return handleError(error);
  }
};
