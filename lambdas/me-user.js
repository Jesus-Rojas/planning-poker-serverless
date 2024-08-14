import { responseDefault } from "../constants/response-default.js";

export const handler = () => ({
  ...responseDefault,
  body: JSON.stringify({ message: 'User is authenticated from api gateway' }),
});
