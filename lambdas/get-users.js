import { handleError } from "../shared/handle-error.js";
import { getUsers } from "../shared/dynamo-client.js";
import { responseDefault } from "../constants/response-default.js";

export const handler = async () => {
  try {
    const users = await getUsers();
    return {
      ...responseDefault,
      body: JSON.stringify(users),
    };
  } catch (error) {
    return handleError(error);
  }
};
