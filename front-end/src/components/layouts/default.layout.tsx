import { Box, Menu } from "@chakra-ui/react";
import { HeaderMenu } from "../menu/header.menu";


export const DefaultLayout: React.FC = ({children}) => {
    return (
      <Box>
        <HeaderMenu />
        {children}
      </Box>
    )
}