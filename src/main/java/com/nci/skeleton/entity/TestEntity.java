package com.nci.skeleton.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
public class TestEntity {

    @Id
    private UUID testId;

    @Column
    private String testName;

    @Column
    private String testValue;
}
