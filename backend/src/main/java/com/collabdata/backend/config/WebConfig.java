package com.collabdata.backend.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import com.collabdata.backend.security.LoggedInUserProvider;
import com.collabdata.backend.security.MockLoginFilter;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public FilterRegistrationBean<MockLoginFilter> mockLoginFilter(LoggedInUserProvider provider) {
        FilterRegistrationBean<MockLoginFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new MockLoginFilter(provider));
        registration.addUrlPatterns("/api/*");
        registration.setOrder(1);
        return registration;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true); // ✅ Now safe since origin is exact .allowedOrigins("*")

    }
}
