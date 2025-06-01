package com.pk.mobywatel.repository;

import com.pk.mobywatel.model.Citizen;
import com.pk.mobywatel.model.Official;
import com.pk.mobywatel.model.UserModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CitizenRepository extends JpaRepository<Citizen, Integer> {
    Optional<Citizen> findByPESEL(String PESEL);
    Optional<Citizen> findByUser(UserModel user);
}
