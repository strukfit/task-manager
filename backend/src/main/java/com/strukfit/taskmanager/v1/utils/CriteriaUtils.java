package com.strukfit.taskmanager.v1.utils;

import org.springframework.stereotype.Component;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Root;

@Component
public class CriteriaUtils {
    private CriteriaUtils() {
    }

    public static <T, E extends Enum<E>> Expression<Integer> mapEnumToOrdinal(
            Root<T> root,
            String fieldName,
            Class<E> enumClass,
            CriteriaBuilder cb) {
        Expression<String> field = root.get(fieldName);
        CriteriaBuilder.Case<Integer> caseExpr = cb.selectCase();

        for (E value : enumClass.getEnumConstants()) {
            caseExpr = caseExpr.when(cb.equal(field, value.name()), value.ordinal());
        }

        return caseExpr.otherwise(-1);
    }
}
