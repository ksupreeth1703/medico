package com.nci.skeleton.controller;

import com.nci.skeleton.entity.Doctor;
import com.nci.skeleton.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/doctor")
public class DoctorController {

    @Autowired
    DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<Doctor>> getDoctors() {
        return new ResponseEntity<>(doctorService.getDoctors(), HttpStatus.OK);
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<Doctor> getDoctorDetail(@PathVariable UUID doctorId) {
        return new ResponseEntity<>(doctorService.getDoctorDetails(doctorId), HttpStatus.OK);
    }

}
