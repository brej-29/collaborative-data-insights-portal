package com.collabdata.backend.graphql;

import java.util.List;

import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.collabdata.backend.model.User;
import com.collabdata.backend.repository.UserRepository;

@Controller
public class UserResolver {

    private final UserRepository userRepo;

    public UserResolver(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @QueryMapping
    public List<User> allUsers() {
        return userRepo.findAll();
    }

    @MutationMapping
    public User createUser(@Argument String username, 
                            @Argument String email, 
                            @Argument String role) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setRole(role);
        return userRepo.save(user);
    }

}
