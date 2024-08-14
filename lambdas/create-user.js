import { responseDefault } from "../constants/response-default.js";
import { createUser } from "../shared/dynamo-client.js";
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
  
    const { name, cedula } = body;
    await createUser({ name, cedula });
    console.log("User was created");
    return {
      ...responseDefault,
      statusCode: 201,
      body: JSON.stringify({
        message: "User created successfully!",
      }),
    };
  } catch (error) {
    return handleError(error);
  }
};

