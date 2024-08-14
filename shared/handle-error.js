import { StatusCodes } from "http-status-codes";
import { responseDefault } from "../constants/response-default.js";

export const handleError = (error = { error: "Problems in server" }) => {
  console.error(error);
  return {
    ...responseDefault,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    body: JSON.stringify(error),
  };
};
