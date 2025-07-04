package com.collabdata.backend.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.UUID;


public class MockLoginFilter implements Filter {

    private final LoggedInUserProvider loggedInUserProvider;

    public MockLoginFilter(LoggedInUserProvider loggedInUserProvider) {
        this.loggedInUserProvider = loggedInUserProvider;
    }

    @SuppressWarnings("unused")
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;

        // Inject a user manually for dev: replace with your UUID
        UUID devUserId = UUID.fromString("bb8eb32f-5764-4522-a84f-a639c6f2c1e0");
        loggedInUserProvider.mockLogin(devUserId);

        chain.doFilter(request, response);
    }
}
