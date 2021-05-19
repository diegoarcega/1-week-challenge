/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './app';

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
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
