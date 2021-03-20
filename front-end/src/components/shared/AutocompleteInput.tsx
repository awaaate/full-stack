import { Box, List, ListItem } from "@chakra-ui/react";
import Downshift from "downshift";
import { useEffect, useState } from "react";

export interface AutocompleteInputProps {
    suggestions: string[];
    onAddition: (value: any) => void;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
    suggestions,
    onAddition,
}) => {
    const [items, setItems] = useState(() => [""].concat(suggestions));
    useEffect(() => {
        setItems(suggestions);
    }, [suggestions]);
    return (
        <Downshift
            id="tags-input"
            onSelect={(value, helpers) => {
                if (value) {
                    onAddition(value);
                    helpers.clearSelection();
                }
            }}
            onInputValueChange={(value) => {
                setItems((items) => {
                    items[0] = value;
                    return items;
                });
            }}
            defaultHighlightedIndex={0}
            itemToString={(item) => item || ""}
        >
            {({
                getInputProps,
                getItemProps,
                getMenuProps,
                getRootProps,
                isOpen,
                inputValue,
                highlightedIndex,
            }) => (
                <Box {...getRootProps()} pos="relative">
                    <Box
                        {...getInputProps()}
                        as="input"
                        bg="night"
                        color="white"
                        border="0"
                        outline="0"
                        placeholder="Add new Skill"
                        w="100%"
                        p={2}
                    />
                    <List
                        {...getMenuProps()}
                        rounded="md"
                        borderStyle="solid"
                        borderColor="lightDark"
                        borderWidth={isOpen && inputValue ? "2px" : "0"}
                        pos="absolute"
                        w="100%"
                        bg="dark"
                    >
                        {isOpen && inputValue
                            ? items
                                  .filter(
                                      (item) =>
                                          !inputValue ||
                                          item
                                              .toLocaleLowerCase()
                                              .includes(
                                                  inputValue.toLocaleLowerCase()
                                              )
                                  )
                                  .map((item, index) => (
                                      <ListItem
                                          {...getItemProps({
                                              key: index,
                                              index,
                                              item: item,
                                          })}
                                          borderTop={index && "2px solid"}
                                          borderColor="lightDark"
                                          cursor="pointer"
                                          p={2}
                                          bg={
                                              highlightedIndex === index
                                                  ? "night"
                                                  : null
                                          }
                                      >
                                          {item}
                                      </ListItem>
                                  ))
                            : null}
                    </List>
                </Box>
            )}
        </Downshift>
    );
};
