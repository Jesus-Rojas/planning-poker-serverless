import { responseDefault } from "../constants/response-default.js";

export const handler = () => ({
  ...responseDefault,
  body: JSON.stringify({
    message: "Hello from serverless!",
  }),
});
