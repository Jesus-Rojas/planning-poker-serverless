const serverless = require("serverless-http");
const express = require("express");
const app = express();
app.use(express.json());

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from serverless!",
  });
});

app.get("/users", (req, res, next) => {
  return res.status(200).json(users);
});

app.get("/users/:id", (req, res, next) => {
  const userId = users.findIndex(user => user.id === parseInt(req.params.id));
  if (userId === -1) return res.status(404).json({ error: 'User not found' });
  return res.status(200).json(users[userId]);
});

app.post("/users", (req, res, next) => {
  const { name } = req.body;
  if (!name) return res.status(422).json({ error: 'Missing name' });
  const newUser = {
    id: users.length + 1,
    name,
  };
  users.push(newUser);
  return res.status(201).json(newUser);
});

app.put("/users/:id", (req, res, next) => {
  const { name } = req.body;
  if (!name) return res.status(422).json({ error: 'Missing name' });
  const userId = users.findIndex(user => user.id === parseInt(req.params.id));
  if (userId === -1) return res.status(404).json({ error: 'User not found' });
  users[userId].name = name;
  return res.status(200).json(users[userId]);
});

app.delete('/users/:id', (req, res) => {
  const userId = users.findIndex(user => user.id === parseInt(req.params.id));
  if (userId === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(userId, 1);
  return res.status(200).json();
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

exports.handler = serverless(app);
