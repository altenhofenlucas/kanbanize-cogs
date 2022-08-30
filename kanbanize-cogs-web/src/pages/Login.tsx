import { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import LoadingButton from '@mui/lab/LoadingButton';
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import { useForm } from "react-hook-form";
import { LoggedUserContext } from "../App";

import logo from "../assets/login-logo.png";
import styles from "./Login.module.css";

type LoginInput = {
  email: string,
  password: string
}

export function Login() {
  const [ loading, setLoading ] = useState(false);
  const { handleLogin } = useContext(LoggedUserContext);
  const { register, handleSubmit, watch } = useForm<LoginInput>();

  const emailInput = watch("email");
  const passwordInput = watch("password");

  async function onSubmit(loginInput: LoginInput) {
    try {
      setLoading(true);
      handleLogin({ 
        email: loginInput.email,
        password: loginInput.password 
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
          <img 
            src={logo}
            alt="Logo" />
          <TextField 
            label="Informe o seu email"
            variant="standard"
            helperText="Utilize o mesmo e-mail do seu usuário do Kanbanize."
            {...register("email", { required: true })}
          />
          <TextField 
            label="Informe sua senha"
            type="password"
            variant="standard"
            helperText="Utilize a mesma senha do seu usuário do Kanbanize."
            {...register("password", { required: true })}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            endIcon={<LoginOutlined />}
            loading={loading}
            loadingPosition="end"
            disabled={!emailInput || !passwordInput}
            disableElevation
          >
            Entrar
          </LoadingButton>
      </form>
    </div>
  )
}