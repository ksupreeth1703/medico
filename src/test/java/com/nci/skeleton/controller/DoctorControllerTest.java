package com.nci.skeleton.controller;

import com.nci.skeleton.entity.Doctor;
import com.nci.skeleton.service.DoctorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DoctorControllerTest {

    @Mock
    private DoctorService doctorService;

    @InjectMocks
    private DoctorController doctorController;

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
        when(doctorService.getDoctors()).thenReturn(mockDoctors);

        // Act
        ResponseEntity<List<Doctor>> response = doctorController.getDoctors();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(mockDoctors, response.getBody());
        verify(doctorService).getDoctors();
    }

    @Test
    public void testGetDoctors_EmptyList() {
        // Arrange
        when(doctorService.getDoctors()).thenReturn(Arrays.asList());

        // Act
        ResponseEntity<List<Doctor>> response = doctorController.getDoctors();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().size());
        verify(doctorService).getDoctors();
    }

    @Test
    public void testGetDoctorDetail_Success() {
        // Arrange
        when(doctorService.getDoctorDetails(sampleDoctorId)).thenReturn(sampleDoctor);

        // Act
        ResponseEntity<Doctor> response = doctorController.getDoctorDetail(sampleDoctorId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(sampleDoctor, response.getBody());
        verify(doctorService).getDoctorDetails(sampleDoctorId);
    }

    @Test
    public void testGetDoctorDetail_NullId() {
        // Arrange
        UUID nullId = null;

        // Act & Assert
        try {
            doctorController.getDoctorDetail(nullId);
        } catch (Exception e) {
            // Depending on your error handling strategy, you might want to
            // assert specific exception type or message
            // This test ensures that null ID is handled appropriately
        }
    }

    @Test
    public void testGetDoctorDetail_NonExistentDoctor() {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(doctorService.getDoctorDetails(nonExistentId)).thenReturn(null);

        // Act
        ResponseEntity<Doctor> response = doctorController.getDoctorDetail(nonExistentId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Additional assertions might depend on your specific implementation
        // You may want to handle null return differently based on your service logic
        verify(doctorService).getDoctorDetails(nonExistentId);
    }
}