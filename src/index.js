const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response
      .status(400)
      .json({ ERRO: "O usuário informado não existe" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui

  const { name, username } = request.body;

  const existentUser = users.some((user) => user.username === username);

  const id = uuidv4();

  if (existentUser) {
    return response.status(400).json({ ERRO: "usuário já existe" });
  }

  users.push({
    id,
    name,
    username,
    todos: [],
  });

  return response.status(201).send(users);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const id = uuidv4();

  const newTodo = {
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  return response.status(201).end();
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request;

  const { id } = request.params;

  const { title, deadline } = request.body;

  user.todos.title = title;

  const checkId = user.todos.find((todo) => todo.id === id)

  console.log(checkId)

  return response.status(200).send();
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
