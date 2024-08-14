import { responseDefault } from "../constants/response-default.js";
import { getUserById, updateUser } from "../shared/dynamo-client.js";
import { getKeysUser } from "../shared/get-keys-user.js";
import { handleError } from "../shared/handle-error.js";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const keysBody = Object.keys(body);
    const keysUser = await getKeysUser();
    const existAllKeysUser = keysUser.every((keyUser) => (
      keysBody.some((keyBody) => keyBody === keyUser)
    ));

    if (!existAllKeysUser) {
      return {
        ...responseDefault,
        statusCode: 422,
        body: JSON.stringify({ error: `Missing ${keysUser.join(" or ")}` }),
      };
    }

    const userId = event.pathParameters.id;
    const user = await getUserById(userId);
    
    if (!user) {
      return {
        ...responseDefault,
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    const { name, cedula } = body;

    await updateUser(userId, { name, cedula });

    return {
      ...responseDefault,
      statusCode: 204,
      body: '',
    };
  } catch (error) {
    return handleError(error);
  }
};
