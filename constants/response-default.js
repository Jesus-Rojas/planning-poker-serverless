import { StatusCodes } from "http-status-codes";

export const responseDefault = {
  headers: {
    "Content-Type": "application/json"
  },
  statusCode: StatusCodes.OK,
}
