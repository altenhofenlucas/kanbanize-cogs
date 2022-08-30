import { useContext } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import { LoggedUserContext } from '../../../App';
import styles from './AppHeader.module.css';

export function AppHeader() {
  const { handleLogout } = useContext(LoggedUserContext);

  return (
    <div className={styles.container}>
      <Typography variant="subtitle2">Olá!</Typography>
      <Button variant="text" onClick={handleLogout}><LogoutIcon />Sair</Button>
    </div>
  )
}
