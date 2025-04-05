package com.nci.skeleton.service;

import com.nci.skeleton.entity.Doctor;
import com.nci.skeleton.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;


@Service
public class DoctorService {

    @Autowired
    DoctorRepository doctorRepository;

    public List<Doctor> getDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorDetails(UUID id) {
        return doctorRepository.findById(id).orElse(new Doctor());
    }


}
