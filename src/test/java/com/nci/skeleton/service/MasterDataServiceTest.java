package com.nci.skeleton.service;

import com.nci.skeleton.model.MasterData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class MasterDataServiceTest {

    @InjectMocks
    private MasterDataService masterDataService;

    @BeforeEach
    void setUp() {
        // Reset static data before each test to ensure clean state
        try {
            MasterDataService.data = new MasterData();
            MasterDataService.data.setSpeciality(List.of("Ophthalmologist","Pediatrician","Neurologist","psychiatrist",
                    "Dermatologist","Oncologist","Cardiologist","Immunologist",
                    "General Practitioner","Urologist","Orthopedist","Rheumatologist","Hematologist","Nephrologist","Orthodontist"));
            MasterDataService.data.setBookingClass(List.of("GENERAL (15 Minutes)","PREMIUM (30 Minutes)","EMERGENCY"));
        } catch (Exception ex) {
            fail("Failed to set up master data: " + ex.getMessage());
        }
    }

    @Test
    void testFetchMasterData_SpecialityListNotNull() {
        MasterData masterData = masterDataService.fetchMasterData();
        assertNotNull(masterData, "Master data should not be null");
        assertNotNull(masterData.getSpeciality(), "Speciality list should not be null");
    }

    @Test
    void testFetchMasterData_SpecialityListContent() {
        MasterData masterData = masterDataService.fetchMasterData();
        List<String> specialities = masterData.getSpeciality();

        assertEquals(15, specialities.size(), "Speciality list should have 15 items");

        // Check for specific specialities
        assertTrue(specialities.contains("Ophthalmologist"), "Should contain Ophthalmologist");
        assertTrue(specialities.contains("Cardiologist"), "Should contain Cardiologist");
        assertTrue(specialities.contains("Pediatrician"), "Should contain Pediatrician");
    }

    @Test
    void testFetchMasterData_BookingClassListNotNull() {
        MasterData masterData = masterDataService.fetchMasterData();
        assertNotNull(masterData.getBookingClass(), "Booking class list should not be null");
    }

    @Test
    void testFetchMasterData_BookingClassListContent() {
        MasterData masterData = masterDataService.fetchMasterData();
        List<String> bookingClasses = masterData.getBookingClass();

        assertEquals(3, bookingClasses.size(), "Booking class list should have 3 items");

        // Check for specific booking classes
        assertTrue(bookingClasses.contains("GENERAL (15 Minutes)"), "Should contain GENERAL booking class");
        assertTrue(bookingClasses.contains("PREMIUM (30 Minutes)"), "Should contain PREMIUM booking class");
        assertTrue(bookingClasses.contains("EMERGENCY"), "Should contain EMERGENCY booking class");
    }

    @Test
    void testFetchMasterData_SameInstanceReturned() {
        MasterData firstFetch = masterDataService.fetchMasterData();
        MasterData secondFetch = masterDataService.fetchMasterData();

        // Verify that the same instance is returned each time
        assertSame(firstFetch, secondFetch, "Should return the same MasterData instance");
    }

    @Test
    void testFetchMasterData_StaticInitialization() {
        // This test ensures that the static initialization block works correctly
        MasterData masterData = MasterDataService.data;
        assertNotNull(masterData, "Static initialization should create MasterData");
        assertNotNull(masterData.getSpeciality(), "Speciality list should be initialized");
        assertNotNull(masterData.getBookingClass(), "Booking class list should be initialized");
    }
}