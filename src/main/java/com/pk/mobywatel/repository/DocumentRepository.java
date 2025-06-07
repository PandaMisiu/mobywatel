package com.pk.mobywatel.repository;

import com.pk.mobywatel.model.Citizen;
import com.pk.mobywatel.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {
    Optional<List<Document>> findByCitizen(Citizen citizen);
}
