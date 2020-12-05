import { Button, Box, Flex } from "@chakra-ui/core";
import { Form, Formik, FormikHelpers } from "formik";
import { InputField } from "./InputField";

type Values = { title: string; text: string };
export interface EditPostFormProps {
    submitButton: string;
    initialValues?: Values;
    onSubmit: (
        values: Values,
        formikHelpers: FormikHelpers<Values>
    ) => void | Promise<any>;
}

export const EditPostForm: React.FC<EditPostFormProps> = ({
    onSubmit,
    submitButton,
    initialValues = { title: "", text: "" },
}) => {
    return (
        <Flex w="100%" h="100%" alignItems="center" justifyContent="center">
            <Box w="100%" maxW="700px">
                <Formik initialValues={initialValues} onSubmit={onSubmit}>
                    {({ isSubmitting }) => (
                        <Form>
                            <InputField
                                name="title"
                                placeholder="Title"
                                label="Title"
                                h="40px"
                            />

                            <InputField
                                name="text"
                                placeholder="text..."
                                label="Text"
                                textarea
                                h="200px"
                                resize="none"
                            />
                            <Button
                                type="submit"
                                mt={4}
                                isLoading={isSubmitting}
                                variantColor="orange"
                                w="100%"
                            >
                                {submitButton}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Flex>
    );
};
