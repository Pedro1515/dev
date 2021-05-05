import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { AlertProvider, NotificationProvider, AuthProvider } from "src/context";
import { fetcher } from "src/utils";
import "typeface-inter";
import "src/styles/tailwind.css";
import "src/styles/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <NotificationProvider>
        <AlertProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </AlertProvider>
      </NotificationProvider>
    </SWRConfig>
  );
}

export default MyApp;
