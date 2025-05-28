package com.pk.mobywatel.repository;

import com.pk.mobywatel.model.PersonalDataUpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonalDataUpdateRequestRepository extends JpaRepository<PersonalDataUpdateRequest, Integer> {
}
