import '@fontsource-variable/archivo';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/chakra-petch/300.css';
import '@fontsource/chakra-petch/400.css';
import '@fontsource/chakra-petch/500.css';
import '@fontsource/chakra-petch/600.css';
import '@fontsource/chakra-petch/700.css';
import '@hackernoon/pixel-icon-library/fonts/iconfont.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { App } from '@/App';
import '@/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
