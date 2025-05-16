package com.pk.mobywatel.service;

import com.pk.mobywatel.model.Official;
import com.pk.mobywatel.repository.OfficialRepository;
import com.pk.mobywatel.request.DeleteOfficialBody;
import com.pk.mobywatel.request.OfficialBody;
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

    // ustaw role 'OFFICIAL'
    public void createOfficialAccount(OfficialBody body){
        throw new UnsupportedOperationException(/* TODO */);
    }

    public void updateOfficialAccount(OfficialBody body){
        throw new UnsupportedOperationException(/* TODO */);
    }

    public void deleteOfficialAccount(DeleteOfficialBody body){
        throw new UnsupportedOperationException(/* TODO */);
    }

    public Official fetchOfficialAccount(String officialID){
        throw new UnsupportedOperationException(/* TODO */);
    }
}
