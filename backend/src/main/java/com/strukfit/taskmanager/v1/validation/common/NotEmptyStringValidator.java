package com.strukfit.taskmanager.v1.validation.common;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NotEmptyStringValidator implements ConstraintValidator<NotEmptyString, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null)
            return true;
        return !value.trim().isEmpty();
    }
}
