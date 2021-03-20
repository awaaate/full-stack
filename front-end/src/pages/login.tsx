import { Button, Heading, Link, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { LayoutWrapper } from "../components/layouts/layout.wrapper";
import { StyledInput } from "../components/shared/StyledInput";
import { useLoginMutation } from "../generated/graphql";
import { withUrqlClientHOC } from "../utils/createUrqlClient";
import { toErrorsMap } from "../utils/toErrorMap";

function Login() {
    const router = useRouter();
    const [, login] = useLoginMutation();

    return (
        <LayoutWrapper layout="login">
            <Heading mb="4" textAlign="center"fontSize="1.5rem"  color="gray.800">
                Login With Your Account
            </Heading>
            <Formik
                initialValues={{
                    usernameOrEmail: "",
                    password: "",
                }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login(values);

                    if (response.data?.login.errors) {
                        setErrors(toErrorsMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        if (typeof router.query.next === "string") {
                            router.push(router.query.next);
                        } else {
                            router.push("/");
                        }
                    } else {
                        console.log(response);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Stack spacing="4">
                            <StyledInput
                                name="usernameOrEmail"
                                placeholder="Username or email"
                                label="Username or email"
                                inputLeftElementChildren={<FaUser />}
                                inputSize="lg"
                            />

                            <StyledInput
                                name="password"
                                placeholder="password"
                                label="Password"
                                type="Password"
                                inputSize="lg"
                                inputLeftElementChildren={<FaLock />}
                            />
                            <Button
                                type="submit"
                                mt={4}
                                isLoading={isSubmitting}
                                colorScheme="brand"
                                w="100%"
                                size="lg"
                            >
                                login
                            </Button>
                        </Stack>
                        <NextLink href="/forgot-password">
                            <Link
                                color="blue.500"
                                textAlign="center"
                                display="block"
                                pt="2"
                            >
                                Forgot password?
                            </Link>
                        </NextLink>
                    </Form>
                )}
            </Formik>
        </LayoutWrapper>
    );
}
Login.layout = "login";
export default withUrqlClientHOC()(Login);
