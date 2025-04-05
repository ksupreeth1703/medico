package com.nci.skeleton.service;

import com.nci.skeleton.entity.Doctor;
import com.nci.skeleton.repository.DoctorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DoctorServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private DoctorService doctorService;

    private Doctor sampleDoctor;
    private UUID sampleDoctorId;

    @BeforeEach
    public void setUp() {
        // Prepare test data
        sampleDoctorId = UUID.randomUUID();
        sampleDoctor = new Doctor();
        sampleDoctor.setId(sampleDoctorId);
        sampleDoctor.setName("Dr. John Doe");
        sampleDoctor.setSpeciality("Cardiology");
    }

    @Test
    public void testGetDoctors_Success() {
        // Arrange
        List<Doctor> mockDoctors = Arrays.asList(sampleDoctor);
        when(doctorRepository.findAll()).thenReturn(mockDoctors);

        // Act
        List<Doctor> result = doctorService.getDoctors();

        // Assert
        assertEquals(mockDoctors, result);
        verify(doctorRepository).findAll();
    }

    @Test
    public void testGetDoctors_EmptyList() {
        // Arrange
        when(doctorRepository.findAll()).thenReturn(Arrays.asList());

        // Act
        List<Doctor> result = doctorService.getDoctors();

        // Assert
        assertTrue(result.isEmpty());
        verify(doctorRepository).findAll();
    }

    @Test
    public void testGetDoctorDetails_ExistingDoctor() {
        // Arrange
        when(doctorRepository.findById(sampleDoctorId))
                .thenReturn(Optional.of(sampleDoctor));

        // Act
        Doctor result = doctorService.getDoctorDetails(sampleDoctorId);

        // Assert
        assertEquals(sampleDoctor, result);
        verify(doctorRepository).findById(sampleDoctorId);
    }

    @Test
    public void testGetDoctorDetails_NonExistentDoctor() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(doctorRepository.findById(nonExistentId))
                .thenReturn(Optional.empty());

        // Act
        Doctor result = doctorService.getDoctorDetails(nonExistentId);

        // Assert
        assertNotNull(result);
        // Verify that an empty Doctor object is returned
        assertNull(result.getId());
        verify(doctorRepository).findById(nonExistentId);
    }

    @Test
    public void testGetDoctorDetails_NullId() {
        // Act
        Doctor result = doctorService.getDoctorDetails(null);

        // Assert
        assertNotNull(result);
        // Verify that an empty Doctor object is returned
        assertNull(result.getId());
    }
}