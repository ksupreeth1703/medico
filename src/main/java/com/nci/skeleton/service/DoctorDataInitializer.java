package com.nci.skeleton.service;

import com.nci.skeleton.entity.Doctor;
import com.nci.skeleton.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Component
public class DoctorDataInitializer implements CommandLineRunner {

    private final DoctorRepository doctorRepository;

    public DoctorDataInitializer(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public void run(String... args) {
        if (doctorRepository.count() == 0) {
            List<Doctor> doctors = List.of(
                    new Doctor(UUID.randomUUID(), "Dr. Ayesha Khan", "MBBS, MD (Cardiology)", "12 years",
                            "Experienced in treating cardiovascular diseases, echocardiography, and interventional cardiology.",
                            new BigDecimal("1500.00"), "Cardiologist",
                            "Apollo Hospital, New Delhi",
                            "https://www.yourfreecareertest.com/wp-content/uploads/2018/01/how_to_become_a_doctor.jpg"),

                    new Doctor(UUID.randomUUID(), "Dr. Rajeev Mehta", "MBBS, MS (Orthopedics)", "10 years",
                            "Specialist in sports injuries, joint replacements, and arthroscopy with numerous successful surgeries.",
                            new BigDecimal("1200.00"), "Orthopedic Surgeon",
                            "Fortis Hospital, Mumbai",
                            "https://thumbs.dreamstime.com/b/indian-doctor-mature-male-medical-standing-inside-hospital-handsome-model-portrait-46325210.jpg"),

                    new Doctor(UUID.randomUUID(), "Dr. Sneha Reddy", "MBBS, DGO", "8 years",
                            "Dedicated to women’s health, experienced in prenatal care, fertility treatments, and gynecological surgeries.",
                            new BigDecimal("1000.00"), "Gynecologist",
                            "Cloudnine Hospital, Bangalore",
                            "https://t4.ftcdn.net/jpg/06/47/16/29/360_F_647162966_SFu8GP6awkeW0OnFnAxPjiGXSoeme4ht.jpg"),

                    new Doctor(UUID.randomUUID(), "Dr. Arvind Patel", "MBBS, MD (Dermatology)", "6 years",
                            "Treats skin allergies, acne, hair loss, and cosmetic dermatology with modern techniques.",
                            new BigDecimal("800.00"), "Dermatologist",
                            "SKIN Clinic, Ahmedabad",
                            "https://media.istockphoto.com/id/1124684854/photo/portrait-of-indian-doctor.jpg?s=612x612&w=0&k=20&c=z07-F84erAbm8Z_sVJhLXdaJBfMFSiJjf_uaHg7Z3sY=")
            );

            doctorRepository.saveAll(doctors);
            System.out.println("Sample doctors inserted into the repository.");
        } else {
            System.out.println("Doctor repository already initialized. Skipping data seeding.");
        }
    }
}

