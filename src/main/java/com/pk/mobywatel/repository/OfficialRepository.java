package com.pk.mobywatel.repository;

import com.pk.mobywatel.model.Official;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfficialRepository extends JpaRepository<Official,Integer> {
}
