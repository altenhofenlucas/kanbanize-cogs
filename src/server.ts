import express from 'express';

const app = express();

app.get("/login", (request, response) => {
  return response.json({ message: "hello" });
});

app.listen(3333, () => console.log("🚀 server is running!"));
