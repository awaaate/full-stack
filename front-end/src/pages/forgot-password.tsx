import { Box, Button, Link } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withUrqlClientHOC } from "../utils/createUrqlClient";

export interface ForgotPasswordProps {}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({}) => {
    const [complete, setComplete] = useState(false);
    const [, forgotPassword] = useForgotPasswordMutation();
    return (
        <Wrapper variant="small" bg="white" p={4} rounded="md" shadow="lg">
            {complete ? (
                <Box
                    color="blue.900"
                    bg="green.200"
                    rounded="md"
                    shadow="md"
                    textAlign="center"
                    p={4}
                >
                    Email sent
                </Box>
            ) : (
                <Formik
                    initialValues={{
                        email: "",
                    }}
                    onSubmit={async (values, {}) => {
                        await forgotPassword(values);
                        setComplete(true);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <InputField
                                name="email"
                                placeholder="email"
                                label="Email"
                                type="email"
                                inputLeftElementChildren="@"
                            />

                            <Button
                                type="submit"
                                mt={4}
                                isLoading={isSubmitting}
                                variantColor="orange"
                                w="100%"
                            >
                                forgot password
                            </Button>
                            <NextLink href="/register">
                                <Link
                                    color="blue.500"
                                    textAlign="center"
                                    display="block"
                                    pt="2"
                                >
                                    don't have an account?
                                </Link>
                            </NextLink>
                        </Form>
                    )}
                </Formik>
            )}
        </Wrapper>
    );
};
export default withUrqlClientHOC()(ForgotPassword);
