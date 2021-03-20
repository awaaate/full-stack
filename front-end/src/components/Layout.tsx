import { Box } from "@chakra-ui/react";
import { Fragment } from "react";
import { NavBar } from "./Navbar";

export interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <Fragment>
            <NavBar />
            <Box bg="gray.100" minH="100vh" pt="100px">
                {children}
            </Box>
        </Fragment>
    );
};
