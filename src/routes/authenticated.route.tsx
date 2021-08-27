import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { isAuthenticated } from 'utils/authentication.util';

function Authenticated({ children }: { children: JSX.Element }): JSX.Element | null {
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "You're not logged in",
        description: 'You must login to use private sections of the platform',
        status: 'warning',
        variant: 'top-accent',
        position: 'top',
      });
    }
  }, [toast]);

  if (isAuthenticated()) {
    return children;
  }

  history.push('/login');

  return null;
}

export default Authenticated;
