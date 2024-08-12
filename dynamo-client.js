import AWS from "aws-sdk";
import { v4 as uuid } from 'uuid';

AWS.config.update({ region: 'us-east-1' });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const defaultParams = {
  TableName: 'Users',
};

export const getUsers = async () => {
  const data = await dynamoDb.scan(defaultParams).promise();
  return data.Items;
}

export const getUserById = async (id) => {
  const params = {
    ...defaultParams,
    Key: { id },
  };
  const data = await dynamoDb.get(params).promise();
  return data.Item;
}

export const createUser = async (body) => {
  const { name, cedula } = body;
  const params = {
    TableName: 'Users',
    Item: {
      id: uuid(),
      name,
      cedula,
    },
  };
  await dynamoDb.put(params).promise();
}

export const deleteUser = async (id) => {
  const params = {
    ...defaultParams,
    Key: { id },
  };
  await dynamoDb.delete(params).promise();
}

export const updateUser = async (id, body) => {
  const { name, cedula } = body;
  const params = {
    ...defaultParams,
    Key: { id },
    UpdateExpression: 'set #name = :name, #cedula = :cedula',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#cedula': 'cedula',
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':cedula': cedula,
    },
  };
  await dynamoDb.update(params).promise();
}