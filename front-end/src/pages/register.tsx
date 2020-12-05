import { Button, Stack, Text } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FaLock, FaUser } from "react-icons/fa";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorsMap } from "../utils/toErrorMap";
import { withUrqlClientHOC } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";

export interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
    const router = useRouter();
    const [, register] = useRegisterMutation();

    return (
        <Layout>
            <Wrapper variant="small" shadow="lg" p="4" rounded="md">
                <Text fontSize="4xl" py={10} textAlign="center">
                    Register
                </Text>
                <Formik
                    initialValues={{ username: "", email: "", password: "" }}
                    onSubmit={async (values, { setErrors }) => {
                        const response = await register({ options: values });

                        if (response.data?.register.errors) {
                            setErrors(
                                toErrorsMap(response.data.register.errors)
                            );
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
                                <InputField
                                    required={true}
                                    name="email"
                                    placeholder="email"
                                    label="Email"
                                    type="email"
                                    inputLeftElementChildren={"@"}
                                />

                                <InputField
                                    required={true}
                                    name="username"
                                    placeholder="username"
                                    label="Username"
                                    inputLeftElementChildren={<FaUser />}
                                />
                                <InputField
                                    required={true}
                                    name="password"
                                    placeholder="password"
                                    label="Password"
                                    type="Password"
                                    inputLeftElementChildren={<FaLock />}
                                />
                                <Button
                                    type="submit"
                                    mt={4}
                                    isLoading={isSubmitting}
                                    variantColor="orange"
                                    w="100%"
                                >
                                    register
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </Layout>
    );
};

export default withUrqlClientHOC()(Register);
