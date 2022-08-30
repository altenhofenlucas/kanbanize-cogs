import { createContext, useEffect, useState } from 'react'
import { Login } from './pages/Login';
import { BoardAnalysis } from './pages/BoardAnalysis';
import { doLogin } from './api/api';

import styles from './App.module.css';

interface ILoggedUserApiKeyContext {
  loggedUserApiKey: string | undefined;
  handleLogin: (login: IHandleLoginProps) => Promise<string>;
  handleLogout: () => void;
}

interface IHandleLoginProps {
  email: string;
  password: string;
}

export const LoggedUserContext = createContext({} as ILoggedUserApiKeyContext);

function App() {
  const [ loggedUserApiKey, setLoggedUserApiKey ] = useState('');

  useEffect(() => {
    const loggedUserApiKey = localStorage.getItem('loggedUserApiKey');

    if (loggedUserApiKey) {
      setLoggedUserApiKey(loggedUserApiKey);
    }
  }, []);

  async function handleLogin({email, password}: IHandleLoginProps): Promise<string> {
    const { apiKey } = await doLogin(email, password);
    setLoggedUserApiKey(apiKey);
    localStorage.setItem('loggedUserApiKey', apiKey);

    return apiKey;
  }

  function handleLogout() {
    localStorage.removeItem('loggedUserApiKey');
    setLoggedUserApiKey('');
  }

  return (
    <div className={styles.container}>
      <LoggedUserContext.Provider value={{
        loggedUserApiKey,
        handleLogin,
        handleLogout
      }}>
        {!loggedUserApiKey ? <Login /> : <BoardAnalysis />}
      </LoggedUserContext.Provider>
    </div>
  )
}

export default App
