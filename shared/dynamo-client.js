import AWS from "aws-sdk";
import { v4 as uuid } from 'uuid';

import { ENV } from "./config.js";
import { getParameterValue, getParameters } from "./ssm.js";

(async () => {
  const ssmNames = [ENV.AWS_REGION];
  const parameters = await getParameters(ssmNames);
  if (ssmNames.length !== parameters.length) throw new Error('Missing parameters');
  const region = getParameterValue(ENV.AWS_REGION, parameters);
  AWS.config.update({ region });
})();

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getDefaultParams = async () => {
  const ssmNames = [ENV.TABLE_NAME_USERS];
  const parameters = await getParameters(ssmNames);
  if (ssmNames.length !== parameters.length) throw new Error('Missing parameters');
  const tableName = getParameterValue(ENV.TABLE_NAME_USERS, parameters);
  return { TableName: tableName };
};

export const getUsers = async () => {
  const defaultParams = await getDefaultParams();
  const data = await dynamoDb.scan(defaultParams).promise();
  return data.Items;
}

export const getUserById = async (id) => {
  const defaultParams = await getDefaultParams();
  const params = {
    ...defaultParams,
    Key: { id },
  };
  const data = await dynamoDb.get(params).promise();
  return data.Item;
}

export const createUser = async (body) => {
  const { name, cedula } = body;
  const defaultParams = await getDefaultParams();
  const params = {
    ...defaultParams,
    Item: {
      id: uuid(),
      name,
      cedula,
    },
  };
  await dynamoDb.put(params).promise();
}

export const deleteUser = async (id) => {
  const defaultParams = await getDefaultParams();
  const params = {
    ...defaultParams,
    Key: { id },
  };
  await dynamoDb.delete(params).promise();
}

export const updateUser = async (id, body) => {
  const { name, cedula } = body;
  const defaultParams = await getDefaultParams();

  const ssmNames = [
    ENV.TABLE_USERS_ALIAS_NAME,
    ENV.TABLE_USERS_ALIAS_CEDULA,
    ENV.TABLE_USERS_PROPERTY_NAME,
    ENV.TABLE_USERS_PROPERTY_CEDULA,
  ];
  const parameters = await getParameters(ssmNames);
  if (ssmNames.length !== parameters.length) throw new Error('Missing parameters');

  const tableUsersAliasName = getParameterValue(ENV.TABLE_USERS_ALIAS_NAME, parameters);
  const tableUsersAliasCedula = getParameterValue(ENV.TABLE_USERS_ALIAS_CEDULA, parameters);
  const tableUsersPropertyName = getParameterValue(ENV.TABLE_USERS_PROPERTY_NAME, parameters);
  const tableUsersPropertyCedula = getParameterValue(ENV.TABLE_USERS_PROPERTY_CEDULA, parameters);

  const updateExpression = [
    `set #${tableUsersAliasName} = :${tableUsersPropertyName}`,
    `#${tableUsersAliasCedula} = :${tableUsersPropertyCedula}`,
  ].join(', ');

  const params = {
    ...defaultParams,
    Key: { id },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: {
      [`#${tableUsersAliasName}`]: tableUsersPropertyName,
      [`#${tableUsersAliasCedula}`]: tableUsersPropertyCedula,
    },
    ExpressionAttributeValues: {
      [`:${tableUsersPropertyName}`]: name,
      [`:${tableUsersPropertyCedula}`]: cedula,
    },
  };
  await dynamoDb.update(params).promise();
}
