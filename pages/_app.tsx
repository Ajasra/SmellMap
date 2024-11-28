import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme";
import { AppProvider } from "../components/context/AppContext";

export default function App({ Component, pageProps }: any) {
  return (
    <MantineProvider theme={theme}>
      <AppProvider>
        <Head>
          <title>Hybrid Phantom</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
          <link rel="shortcut icon" href="/favicon.png" />
        </Head>
        <Component {...pageProps} />
      </AppProvider>
    </MantineProvider>
  );
}
