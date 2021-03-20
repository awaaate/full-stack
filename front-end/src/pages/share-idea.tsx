import React from "react";

import { Box, Button, Input, Text } from "@chakra-ui/react";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { LayoutWrapper } from "../components/layouts/layout.wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { FormikForm } from "../lib/formik.form";
import { useIsAuth } from "../utils/useIsAuth";
import { RichEditor } from "../components/shared/RichEditor";
import { EditorState } from "draft-js";
import { withUrqlClientHOC } from "../utils/createUrqlClient";

import { stateToHTML } from "draft-js-export-html";
import { AutocompleteInput } from "../components/shared/AutocompleteInput";

export interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
    const router = useRouter();
    const [, createPost] = useCreatePostMutation();

    useIsAuth();
    return (
        <LayoutWrapper>
            <Box w="100%" maxW="600px" m="auto" bg="white" p="2" mt="10px">
                <Text
                    color="gray.800"
                    my="4"
                    textAlign="center"
                    fontSize="1.25rem"
                >
                    Share your Idea with the world
                </Text>
                <Formik
                    initialValues={{
                        title: "",
                        text: EditorState.createEmpty(),
                    }}
                    onSubmit={async (values) => {
                        const text = stateToHTML(
                            values.text.getCurrentContent()
                        );

                        await createPost({
                            input: {
                                ...values,
                                text,
                            },
                        });
                        router.push("/");
                    }}
                >
                    {({
                        getFieldProps,
                        values,
                        setFieldValue,
                        isSubmitting,
                    }) => (
                        <FormikForm>
                            <Input
                                {...getFieldProps("title")}
                                focusBorderColor="gray.500"
                                rounded="sm"
                                mb="4"
                            />
                            <RichEditor
                                state={values.text}
                                onChange={(s) => setFieldValue("text", s)}
                            />
                            <AutocompleteInput 
                                suggestions={["Hello", "my Name is tomas"]}
                                onAddition={() => {}}
                            />
                            <Button
                                type="submit"
                                mt={4}
                                isLoading={isSubmitting}
                                colorScheme="brand"
                                w="100%"
                            >
                                Share
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            </Box>
        </LayoutWrapper>
    );
};

export default withUrqlClientHOC({ ssr: true })(CreatePost);
