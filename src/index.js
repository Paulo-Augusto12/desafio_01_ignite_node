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
      .json({ error: "O usuário informado não existe" });
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
    return response.status(400).json({ error: "usuário já existe" });
  }

  const user = {
    id,
    name,
    username,
    todos: [],
  };
  users.push(user);

  return response.status(201).send(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.send(user.todos);
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

  return response.status(201).send(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request;
  const { title, deadline } = request.body;

  const { id } = request.params;

  const selectedTodo = user.todos.find((todoid) => todoid.id === id);

  const checkId = user.todos.map((x) => x);

  if (checkId.includes(selectedTodo) === false) {
    return response.status(404).json({ error: "id não existente" });
  }

  selectedTodo.title = title;
  selectedTodo.deadline = deadline;

  return response.status(201).send(selectedTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const { id } = request.params;

  const { done_todo } = request.query;

  const selectedTodo = user.todos.find((todoid) => todoid.id === id);

  const checkTodos = user.todos.map((x) => x);

  if (checkTodos.includes(selectedTodo) === false) {
    return response.status(404).json({
      error: "should not be able to mark a non existing todo as done",
    });
  }

  selectedTodo.done = true;

  return response.status(200).send(selectedTodo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request;

  const { id } = request.params;

  const selectedTodo = user.todos.find((todoid) => todoid.id === id);

  const checkTodo = user.todos.map((x) => x);

  if (checkTodo.includes(selectedTodo) === false) {
    return response
      .status(404)
      .json({ error: "should not be able to delete a non existing todo" });
  }

  user.todos.splice(selectedTodo, 1);

  return response.status(204).send();
});

module.exports = app;
