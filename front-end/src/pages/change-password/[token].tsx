import { Alert, Box, Button, Link, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { InputField } from "../../components/InputField";
import { LayoutWrapper } from "../../components/layouts/layout.wrapper";
import { StyledInput } from "../../components/shared/StyledInput";
import { useChangePasswordMutation } from "../../generated/graphql";
import { withUrqlClientHOC } from "../../utils/createUrqlClient";
import { toErrorsMap } from "../../utils/toErrorMap";

function ChangePassword() {
    const [, changePassword] = useChangePasswordMutation();
    const router = useRouter();
    const [tokenError, setTokenError] = useState("");
    return (
        <LayoutWrapper layout="login">
            <Formik
                initialValues={{
                    newPassword: "",
                    repeatPassword: "",
                }}
                onSubmit={async (values, { setErrors }) => {
                    if (values.newPassword !== values.repeatPassword) {
                        setErrors({
                            repeatPassword: "passwords don't match",
                        });
                        return;
                    }
                    const response = await changePassword({
                        token:
                            typeof router.query.token === "string"
                                ? router.query.token
                                : "",
                        newPassword: values.newPassword,
                    });

                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorsMap(
                            response.data.changePassword.errors
                        );

                        if ("token" in errorMap) {
                            setTokenError(errorMap.token);
                        }

                        setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        router.push("/");
                    } else {
                        console.log(response);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Stack spacing="4">
                            <StyledInput
                                name="newPassword"
                                placeholder="new password"
                                label="New password"
                                type="password"
                                inputLeftElementChildren={<FaLock />}
                            />

                            <StyledInput
                                name="repeatPassword"
                                placeholder="repeat password"
                                label="Repeat password"
                                type="Password"
                                inputLeftElementChildren={<FaLock />}
                            />
                            {tokenError ? (
                                <Box>
                                    <Alert
                                        color="red.800"
                                        bg="red.200"
                                        rounded="md"
                                        p="2"
                                        mt="2"
                                    >
                                        {tokenError}
                                    </Alert>
                                    <NextLink href="/forgot-password">
                                        <Link
                                            color="blue.500"
                                            textAlign="center"
                                            display="block"
                                            pt="2"
                                        >
                                            Reset my password
                                        </Link>
                                    </NextLink>
                                </Box>
                            ) : null}

                            <Button
                                type="submit"
                                mt={4}
                                isLoading={isSubmitting}
                                colorScheme="brand"
                                w="100%"
                            >
                                Login
                            </Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </LayoutWrapper>
    );
}

export default withUrqlClientHOC()(ChangePassword);
