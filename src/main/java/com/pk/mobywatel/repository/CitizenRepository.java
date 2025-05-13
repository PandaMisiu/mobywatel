package com.pk.mobywatel.repository;

import com.pk.mobywatel.model.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CitizenRepository extends JpaRepository<Citizen,Integer> {
    Optional<Citizen> findByPESEL(String PESEL);
}
