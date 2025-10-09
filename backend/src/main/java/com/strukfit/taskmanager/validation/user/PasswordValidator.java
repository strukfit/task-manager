package com.strukfit.taskmanager.validation.user;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {
    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) {
            return false;
        }

        boolean hasUppercase = !password.equals(password.toLowerCase());
        boolean hasLowercase = !password.equals(password.toUpperCase());
        boolean hasDigit = password.matches(".*\\d.*");
        boolean noWhitespace = !password.contains(" ");
        boolean validLength = password.length() >= 8 && password.length() <= 128;

        return hasUppercase && hasLowercase && hasDigit && noWhitespace && validLength;
    }
}
