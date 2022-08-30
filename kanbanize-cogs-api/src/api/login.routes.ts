import axios from 'axios';
import { Request, Response, Router } from 'express';

const baseUrlLogin = 'https://involves.kanbanize.com/index.php/api/kanbanize';

const loginRouter = Router();

interface Login {
  email: string;
  password: string;
}

loginRouter.post("/", async (request: Request, response: Response) => {
  const login: Login = request.body;

  const { data } = await axios.post(`${baseUrlLogin}/login`, {
    "email": login.email,
    "pass": login.password
  });

  return response.json({ apiKey: data.apikey });
})

export { loginRouter }
