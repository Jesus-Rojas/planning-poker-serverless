import { responseDefault } from "../constants/response-default.js";

export const handleError = (error = { error: "Problems in server" }) => {
  console.error(error);
  return {
    ...responseDefault,
    statusCode: 500,
    body: JSON.stringify(error),
  };
};
