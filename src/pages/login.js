import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link as ReactLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios'
import { BACKEND_LINK } from '../backend-link';

const theme = createTheme();
const login_url = `${BACKEND_LINK}api/login`

const Login = (props) =>  {

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

	axios
	.post( login_url , {
	  username: data.get("username"),
	  password: data.get("password"),
	})
	.then((res) => {
	  if (res?.data?.status === "SUCCESS") {
        props.setLogin(true)
        // props.setUser(res.data.user)
        localStorage.setItem('USER', JSON.stringify({
          name: res.data.name,
          token: 'Bearer ' + res.data.token
        }));
        navigate('/')
        window.location.reload()
	  } else {
          alert("LOGIN FAILED!");
      }
	})
	.catch((err) => {
	  alert(err);
	  // console.log(err)
	});
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <ReactLink to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </ReactLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login