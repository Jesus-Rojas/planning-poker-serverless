import { responseDefault } from "../constants/response-default.js";

export const handler = async () => ({
  ...responseDefault,
  body: JSON.stringify({
    message: "Hello from serverless!",
  }),
});
