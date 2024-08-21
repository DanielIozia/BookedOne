package BackEnd.BookedOne.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import BackEnd.BookedOne.repositories.UserRepository;
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
}
