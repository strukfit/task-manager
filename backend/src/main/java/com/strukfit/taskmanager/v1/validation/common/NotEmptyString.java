package com.strukfit.taskmanager.v1.validation.common;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Constraint(validatedBy = NotEmptyStringValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface NotEmptyString {
    String message() default "String must not be empty or whitespace";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}