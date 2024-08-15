import { responseDefault } from "../constants/response-default.js";

export const handler = async () => ({
  ...responseDefault,
  body: JSON.stringify({ message: 'User is authenticated from api gateway' }),
});
