import { Button, Link } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FaLock, FaUser } from "react-icons/fa";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { toErrorsMap } from "../utils/toErrorMap";
import { withUrqlClientHOC } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";

export interface LoginProps {}

export const Login: React.FC<LoginProps> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();

    return (
        <Layout>
            <Wrapper variant="small" bg="white" p={4} rounded="md" shadow="lg">
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
                            <InputField
                                name="usernameOrEmail"
                                placeholder="Username or email"
                                label="Username or email"
                                inputLeftElementChildren={<FaUser />}
                            />

                            <InputField
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
                                login
                            </Button>
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
            </Wrapper>
        </Layout>
    );
};

export default withUrqlClientHOC()(Login);
