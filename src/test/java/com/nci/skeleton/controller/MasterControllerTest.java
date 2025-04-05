package com.nci.skeleton.controller;

import com.nci.skeleton.model.MasterData;
import com.nci.skeleton.service.MasterDataService;
import com.nci.skeleton.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MasterControllerTest {

    @Mock
    private MasterDataService masterDataService;

    @Mock
    private BookingService bookingService;

    @InjectMocks
    private MasterController masterController;

    private MasterData sampleMasterData;

    @BeforeEach
    public void setUp() {
        // Prepare test data
        sampleMasterData = new MasterData();
    }

    @Test
    public void testGetMasterData_Success() {
        // Arrange
        when(masterDataService.fetchMasterData()).thenReturn(sampleMasterData);

        // Act
        ResponseEntity<MasterData> response = masterController.getMasterData();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(sampleMasterData, response.getBody());

        // Verify that fetchMasterData method was called exactly once
        verify(masterDataService).fetchMasterData();
    }

    @Test
    public void testGetMasterData_NullResponse() {
        // Arrange
        when(masterDataService.fetchMasterData()).thenReturn(null);

        // Act
        ResponseEntity<MasterData> response = masterController.getMasterData();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Depending on your implementation, you might want to add more specific assertions
        verify(masterDataService).fetchMasterData();
    }

    @Test
    public void testGetMasterData_EmptyMasterData() {
        // Arrange
        MasterData emptyMasterData = new MasterData();
        when(masterDataService.fetchMasterData()).thenReturn(emptyMasterData);

        // Act
        ResponseEntity<MasterData> response = masterController.getMasterData();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        // Add more specific assertions based on your MasterData class structure
        verify(masterDataService).fetchMasterData();
    }
}