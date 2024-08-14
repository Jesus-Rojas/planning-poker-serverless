import { ENV } from "./config.js";
import { getParameterValue, getParameters } from "./ssm.js";

export const getKeysUser = async () => {
  const ssmNames = [ENV.TABLE_USERS_PROPERTY_NAME, ENV.TABLE_USERS_PROPERTY_CEDULA];
  const parameters = await getParameters(ssmNames);
  if (ssmNames.length !== parameters.length) throw new Error('Missing parameters');
  const keyUserName = getParameterValue(ENV.TABLE_USERS_PROPERTY_NAME, parameters);
  const keyUserCedula = getParameterValue(ENV.TABLE_USERS_PROPERTY_CEDULA, parameters);
  return [ keyUserName, keyUserCedula ];
};
