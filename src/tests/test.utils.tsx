import React, { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, RenderResult } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // it can break tests because it will show loading state when you want it to fail
    },
  },
});

const Providers = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider resetCSS>{children}</ChakraProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export function renderApp(ui: ReactElement): RenderResult {
  return render(<Providers>{ui}</Providers>);
}
