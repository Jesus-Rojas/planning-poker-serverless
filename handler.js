import serverless from "serverless-http";
import express from "express";
import AWS from 'aws-sdk';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./dynamo-client.js";
import { ENV } from "./config.js";
import { getParameterValue, getParameters } from "./ssm.js";

const app = express();
app.use(express.json());

const sns = new AWS.SNS();

const keysUser = [];

(async () => {
  const ssmNames = [ENV.TABLE_USERS_PROPERTY_NAME, ENV.TABLE_USERS_PROPERTY_CEDULA];
  const parameters = await getParameters(ssmNames);
  if (ssmNames.length !== parameters.length) throw new Error('Missing parameters');
  const keyUserName = getParameterValue(ENV.TABLE_USERS_PROPERTY_NAME, parameters);
  const keyUserCedula = getParameterValue(ENV.TABLE_USERS_PROPERTY_CEDULA, parameters);
  keysUser.push(keyUserName, keyUserCedula);
})();

const handleError = (res) => (res.status(500).json({ error: "Problems in server" }));

app.get("/", (__, res) => {
  return res.status(200).json({
    message: "Hello from serverless!",
  });
});

app.get("/users", async (__, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    handleError(res);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    handleError(res);
  }
});

app.post("/users", async (req, res) => {
  const { body } = req;
  const keysBody = Object.keys(body);
  const existAllKeysUser = keysUser.every((keyUser) => (
    keysBody.some((keyBody) => keyBody === keyUser)
  ));

  if (!existAllKeysUser) {
    return res.status(422).json({ error: `Missing ${keysUser.join(" or ")}` });
  }

  const { name, cedula } = body;
  try {
    await createUser({ name, cedula });
    console.log("User was created");
    return res.status(204).json();
  } catch (error) {
    handleError(res);
  }
});

app.put("/users/:id", async (req, res) => {
  const { body } = req;
  const keysBody = Object.keys(body);
  const existAllKeysUser = keysUser.every((keyUser) => (
    keysBody.some((keyBody) => keyBody === keyUser)
  ));
  if (!existAllKeysUser) {
    return res.status(422).json({ error: `Missing ${keysUser.join(" or ")}` });
  }

  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const { name, cedula } = body;
    await updateUser(req.params.id, { name, cedula });
    return res.status(204).json();
  } catch (error) {
    handleError(res);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await deleteUser(req.params.id);
    return res.status(204).json(user);
  } catch (error) {
    handleError(res);
  }
});

app.get('/send-email', async (req, res) => {
  const message = 'Este es el cuerpo del mensaje de correo electrónico.';
  const subject = 'Asunto del correo electrónico';
  const ssmNames = [ENV.ARN_THEME_SNS];
  const parameters = await getParameters(ssmNames);
  if (parameters.length !== ssmNames.length) return handleError(res);
  const topicArn = getParameterValue(ENV.ARN_THEME_SNS, parameters);
  const params = {
    Message: message,
    Subject: subject,
    TopicArn: topicArn,
  };
  try {
    const data = await sns.publish(params).promise();
    console.log(`Message ${data.MessageId} sent to the topic ${params.TopicArn}`);
    return res.status(200).json({
      message: `Correo enviado con ID: ${data.MessageId}`
    });
  } catch (err) {
    console.error(err, err.stack);
    handleError(res);
  }
});

app.get('/me-user', async (req, res) => {
  return res.status(200).json({
    message: 'User is authenticated from api gateway',
  });
});

app.use((__, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);
