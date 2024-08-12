import serverless from "serverless-http";
import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./dynamo-client.js";

const app = express();
app.use(express.json());

const keysUser = ["name", "cedula"];
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

app.use((__, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);
