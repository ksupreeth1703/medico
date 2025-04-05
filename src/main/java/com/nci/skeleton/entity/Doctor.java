package com.nci.skeleton.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Doctor {
    @Id
    private UUID id;
    private String name;
    private String qualification;
    private String experience;
    @Column(length = 3000)
    private String description;
    private BigDecimal price;
    private String speciality;
    private String address;
    @Column(length = 2000)
    private String image;
}
