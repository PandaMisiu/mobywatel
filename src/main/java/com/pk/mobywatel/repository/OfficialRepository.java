package com.pk.mobywatel.repository;

import com.pk.mobywatel.model.Official;
import com.pk.mobywatel.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfficialRepository extends JpaRepository<Official,Integer> {
    Optional<Official> findByUser(UserModel user);
}
