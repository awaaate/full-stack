import { extendTheme } from "@chakra-ui/react";
export const ChakraTheme = extendTheme({
    styles: {
        global: {
            "html, body": {
                bg: "gray.50",
                h: "100%",
                minH: "100vh",
                color: "gray.900",
            },
            "#__next": {
                h: "100%",
            },
            " div.DraftEditor-root": {
                h: "200px",
            },
            "div.DraftEditor-editorContainer,div.public-DraftEditor-content": {
                height: "100%",
            },
        },
    },
    colors: {
        brand: {
            50: "#def0ff",
            100: "#afd0ff",
            200: "#7db1ff",
            300: "#4b91ff",
            400: "#1a72ff",
            500: "#0058e6",
            600: "#0045b4",
            700: "#003182",
            800: "#001d51",
            900: "#000a21",
        },
    },
});
