import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { LayoutWrapper } from "../components/layouts/layout.wrapper";
import { StyledInput } from "../components/shared/StyledInput";
import { useRegisterMutation } from "../generated/graphql";
import { withUrqlClientHOC } from "../utils/createUrqlClient";
import { toErrorsMap } from "../utils/toErrorMap";
export interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();

    return (
        <LayoutWrapper layout="login">
            <Heading mb="4" textAlign="center" fontSize="1.5rem" color="gray.800">
                Register
            </Heading>
            <Formik
                initialValues={{ username: "", email: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register({ options: values });

                    if (response.data?.register.errors) {
                        setErrors(toErrorsMap(response.data.register.errors));
                    } else if (response.data?.register.user) {
                        router.push("/");
                    } else {
                        console.log(response);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Stack spacing={4}>
                            <StyledInput
                                required={true}
                                name="email"
                                placeholder="email"
                                label="Email"
                                type="email"
                                inputSize="lg"
                                inputLeftElementChildren={"@"}
                            />

                            <StyledInput
                                required={true}
                                name="username"
                                placeholder="username"
                                label="Username"
                                inputSize="lg"
                                inputLeftElementChildren={<FaUser />}
                            />
                            <StyledInput
                                required={true}
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
                                size="lg"
                            >
                                register
                            </Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </LayoutWrapper>
    );
};
export default withUrqlClientHOC()(Register);
