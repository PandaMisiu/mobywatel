package com.pk.mobywatel.repository;

import com.pk.mobywatel.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserModelRepository extends JpaRepository<UserModel, Integer> {
}
