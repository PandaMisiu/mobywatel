package com.pk.mobywatel.repository;

import com.pk.mobywatel.model.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CitizenRepository extends JpaRepository<Citizen,Integer> {
    Optional<Citizen> findByPESEL(String PESEL);
}
