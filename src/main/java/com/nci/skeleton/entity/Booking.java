package com.nci.skeleton.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Data
@Table(name = "appointments")
public class Booking {
    @Id
    private UUID id;
    private String doctorId;
    private BigDecimal price;
    private String bookingClass;
    private String appointmentDate;
    private String appointmentTime;
    private String status;
    private String bookedBy;
    private LocalDateTime bookedOn;
    private LocalDateTime modifiedOn;
}
