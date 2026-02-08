package org.example.attendancebackend.repository;

import lombok.NonNull;
import org.example.attendancebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserRepository extends JpaRepository<@NonNull User, @NonNull Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmailIgnoreCase(String email);
}
