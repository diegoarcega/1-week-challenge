/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import App from './app';

export const queryClient = new QueryClient();

if (process.env.NODE_ENV === 'development') {
  /* eslint-disable global-require */
  /* eslint-disable @typescript-eslint/no-var-requires */
  const { worker } = require('./mocks/browser');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  worker.start();
  /* eslint-enable global-require */
  /* eslint-enable @typescript-eslint/no-var-requires */
}

const theme = extendTheme({
  styles: {
    global: {
      'html,body, #root': {
        backgroundColor: 'gray.100',
        minHeight: '100%',
        'min-height': '-webkit-fill-available',
        height: '100%',
        paddingBottom: '10',
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById('root')
);
