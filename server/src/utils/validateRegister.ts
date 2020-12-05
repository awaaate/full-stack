import { UsernamePasswordType } from "../types/UsernamePassword";
import { FieldError } from "../types/FieldError";

export const validateRegister = (options: UsernamePasswordType) => {
    const invalidCharactersRegex = new RegExp("[^A-Za-z0-9]");
    if (options.username.length <= 3) {
        return [
            new FieldError(
                "username",
                "username must be at least 3 character or greater"
            ),
        ];
    }
    if (!options.email.includes("@")) {
        return [new FieldError("email", "invalid email")];
    }
    if (invalidCharactersRegex.test(options.username)) {
        return [new FieldError("email", "invalid username")];
    }
    if (options.password.length <= 2) {
        return [
            new FieldError(
                "password",
                "Password must be at least 2 character or greater"
            ),
        ];
    }
    return null;
};
