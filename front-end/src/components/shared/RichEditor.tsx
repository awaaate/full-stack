import { Editor, EditorState, RichUtils } from "draft-js";
import { Box, Button, ButtonGroup, Flex, Tooltip } from "@chakra-ui/react";
import React from "react";
import { FaBold, FaHeading, FaItalic, FaList } from "react-icons/fa";

export interface RichEditorProps {
    state: EditorState;
    onChange: (state: EditorState) => void;
}

export const RichEditor: React.FC<RichEditorProps> = ({ state, onChange }) => {
    function handleKeyCommand(command: string, editorState: EditorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            onChange(newState);
            return "handled";
        }

        return "not-handled";
    }
    function toggleInlineStyle(style: string) {
        return () => onChange(RichUtils.toggleInlineStyle(state, style));
    }
    function toggleBlockType(type: string) {
        return () => onChange(RichUtils.toggleBlockType(state, type));
    }
    return (
        <Box
            bg="white"
            border="2px solid"
            borderColor="gray.200"
            rounded="sm"
            m="0"
            overflow="hidden"
        >
            <Flex w="100%" bg="gray.100" color="gray.700" p="1">
                <ButtonGroup isAttached>
                    <Tooltip label="Bold">
                        <Button onClick={toggleInlineStyle("BOLD")}>
                            <FaBold />
                        </Button>
                    </Tooltip>
                    <Tooltip label="Italic">
                        <Button>
                            <FaItalic onClick={toggleInlineStyle("ITALIC")} />
                        </Button>
                    </Tooltip>
                    <Tooltip label="List">
                        <Button
                            onClick={toggleBlockType("unordered-list-item")}
                        >
                            <FaList />
                        </Button>
                    </Tooltip>
                    <Tooltip label="Heading">
                        <Button onClick={toggleBlockType("header-two")}>
                            <FaHeading />
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Flex>
            <Box p="4">
                {typeof window !== "undefined" && (
                    <Editor
                        editorState={state}
                        onChange={onChange}
                        handleKeyCommand={handleKeyCommand}
                    />
                )}
            </Box>
        </Box>
    );
};
