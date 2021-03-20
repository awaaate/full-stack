import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { ChakraTheme } from "../lib/chakra.theme";

function MyApp({ Component, pageProps,  }: AppProps) {
    return (
        <ChakraProvider theme={ChakraTheme}>
                <Component {...pageProps} />
        </ChakraProvider>
    );
}

export default MyApp;
