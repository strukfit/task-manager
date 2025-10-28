package com.strukfit.taskmanager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ApiVersionConfig implements WebMvcConfigurer {
    @Override
    public void configurePathMatch(@NonNull PathMatchConfigurer configurer) {
        configurer.addPathPrefix("/v1",
                c -> c.isAnnotationPresent(RestController.class)
                        && c.getPackageName().startsWith("com.strukfit.taskmanager.v1"));
    }
}
