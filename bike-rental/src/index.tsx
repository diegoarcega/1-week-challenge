import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { worker } from './mocks/browser';

import App from './app';

export const queryClient = new QueryClient();

// STARTS MOCKED BACKED
function init() {
  worker.start().then(console.log).catch(console.error);
}

init();

const theme = extendTheme({
  styles: {
    global: {
      'html,body, #root': {
        backgroundColor: 'gray.100',
        minHeight: '100%',
        'min-height': '-webkit-fill-available',
        height: '100%',
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
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,

  document.getElementById('root')
);
