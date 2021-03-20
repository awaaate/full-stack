import { Box, Button, Link, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { LayoutWrapper } from "../components/layouts/layout.wrapper";
import { StyledInput } from "../components/shared/StyledInput";
import { useForgotPasswordMutation } from "../generated/graphql";
import { NextLink } from "../lib/next.link";
import { withUrqlClientHOC } from "../utils/createUrqlClient";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid Email").required("Required"),
});

function ForgotPassword(){
    const [complete, setComplete] = useState(false);
    const [, forgotPassword] = useForgotPasswordMutation();
    return (
        <LayoutWrapper layout="login">
            {complete ? (
                <Box
                    color="gray.900"
                    rounded="md"
                    textAlign="center"
                    fontSize="1.25rem"
                    p={4}
                >
                    The email has been sent
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
                    validationSchema={validationSchema}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Stack spacing="4">
                                <StyledInput
                                    name="email"
                                    placeholder="email"
                                    label="Email"
                                    type="string"
                                    inputLeftElementChildren="@"
                                />

                                <Button
                                    type="submit"
                                    isLoading={isSubmitting}
                                    colorScheme="brand"
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
                            </Stack>
                        </Form>
                    )}
                </Formik>
            )}
        </LayoutWrapper>
    );
};
export default withUrqlClientHOC()(ForgotPassword);
