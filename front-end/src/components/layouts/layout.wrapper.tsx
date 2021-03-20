import { DefaultLayout } from "./default.layout";
import { LoginAndRegisterLayout } from "./login-and-register.layout";

const Layouts = {
    login: LoginAndRegisterLayout,
    default: DefaultLayout,
};

export const LayoutWrapper: React.FC<{ layout?: keyof typeof Layouts }> = ({
    children,
    layout = "default",
}) => {
    const Layout = Layouts[layout];
    return <Layout>{children}</Layout>;
};
