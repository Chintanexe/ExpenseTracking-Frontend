import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import RequestForm from "./form";


const Welcome = (props) => {

    const [line, setLine] = useState('');

    const CHECKLOGIN = async () => {

        if (!props.user) return;
        if (!props.login) return;

        setLine('Hello, ' + props.user.name);
    }

    useEffect( () => {
      CHECKLOGIN();
      // eslint-disable-next-line
    }, [props])

  return (
      <Container justifycontent="center">
        <Typography variant="h4" m={5}>
             {
                props.login ? line : "You must login to continue!"
             }
             <p/>
             {
                props.login ? <RequestForm user={props.user} /> : null
             }
             <p/>
        </Typography>
      </Container>
  )
}

export default Welcome;