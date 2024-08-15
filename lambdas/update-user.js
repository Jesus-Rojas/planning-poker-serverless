import { StatusCodes } from "http-status-codes";
import { responseDefault } from "../constants/response-default.js";
import { getUserById, updateUser } from "../shared/dynamo-client.js";
import { getKeysUser } from "../shared/get-keys-user.js";
import { handleError } from "../shared/handle-error.js";

const handleErrorCustom = () => ({
  ...responseDefault,
  statusCode: StatusCodes.NOT_FOUND,
  body: JSON.stringify({ error: "User not found" }),
});

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
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        body: JSON.stringify({ error: `Missing ${keysUser.join(" or ")}` }),
      };
    }

    const userId = event.pathParameters.id;
    if (!userId) return handleErrorCustom();
    const user = await getUserById(userId);
    if (!user) return handleErrorCustom();
    const { name, cedula } = body;
    await updateUser(userId, { name, cedula });

    return {
      ...responseDefault,
      statusCode: StatusCodes.NO_CONTENT,
      body: '',
    };
  } catch (error) {
    return handleError(error);
  }
};
