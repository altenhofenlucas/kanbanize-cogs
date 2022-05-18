import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();

app.use(express.json())

interface LoginResult {
  email: string;
  username: string;
  realname: string;
  companyname: string;
  timezone: string;
  userid: string;
  apikey: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

app.post("/login", async (req: Request, res: Response) => {
  const login: LoginRequestBody = req.body
  const { data } = await axios.post('https://involves.kanbanize.com/index.php/api/kanbanize/login/', {
    "email": login.email,
    "pass": login.password
  })
  return res.json(data.apikey);
});

app.listen(3333, () => console.log("🚀 server is running!"));
