import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import EventEmitter from 'utils/event-emitter.utils';
import { Routes } from 'routes/routes';
import { AUTHENTICATION_TOKEN_EXPIRED } from 'constants/authentication.constant';

function App(): JSX.Element {
  const toast = useToast();
  const history = useHistory();

  useEffect(() => {
    function logoutWithMessage() {
      toast({
        title: 'Session expired!',
        description: 'Please login again',
        status: 'warning',
      });
      history.push('/login');
    }

    EventEmitter.on(AUTHENTICATION_TOKEN_EXPIRED, logoutWithMessage);
    return () => {
      EventEmitter.off(AUTHENTICATION_TOKEN_EXPIRED, logoutWithMessage);
    };
  }, [toast, history]);

  return <Routes />;
}

export default App;
