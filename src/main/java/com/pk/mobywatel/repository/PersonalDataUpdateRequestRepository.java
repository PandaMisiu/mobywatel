package com.pk.mobywatel.repository;

import com.pk.mobywatel.model.PersonalDataUpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface PersonalDataUpdateRequestRepository extends JpaRepository<PersonalDataUpdateRequest, Integer> {
    @Modifying
    @Transactional
    @Query("UPDATE PersonalDataUpdateRequest u SET u.approved = :approved, u.processed = TRUE WHERE u.requestID = :requestID")
    void updatePersonalDataRequest(@Param("requestID") Integer requestID, @Param("approved") Boolean approved);
}
