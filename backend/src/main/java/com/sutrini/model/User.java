package com.sutrini.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Set;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String email;
    private String password;
    private String firstName;
    private String lastName;

    private Set<Role> roles;

    private boolean active = true;
}
