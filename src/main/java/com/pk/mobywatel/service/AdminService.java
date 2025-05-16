package com.pk.mobywatel.service;

import com.pk.mobywatel.model.Official;
import com.pk.mobywatel.repository.OfficialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OfficialRepository officialRepository;

    public List<Official> fetchOfficialsData(){
        return officialRepository.findAll();
    }
}
