package com.nci.skeleton.service;

import com.nci.skeleton.entity.Booking;
import com.nci.skeleton.entity.Doctor;
import com.nci.skeleton.model.ResponseModel;
import com.nci.skeleton.repository.BookingRepository;
import com.nci.skeleton.repository.DoctorRepository;
import com.nci.skeleton.repository.UserRepository;
import com.nci.skeleton.security.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static com.nci.skeleton.config.Constants.STATUS_ACTIVE;
import static com.nci.skeleton.config.Constants.STATUS_INACTIVE;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SQSService sqsService;

    @InjectMocks
    private BookingService bookingService;

    private Booking sampleBooking;
    private User sampleUser;
    private Doctor sampleDoctor;
    private UUID sampleBookingId;
    private String username;

    @BeforeEach
    public void setUp() {
        // Prepare test data
        sampleBookingId = UUID.randomUUID();
        username = "testuser@example.com";

        sampleBooking = new Booking();
        sampleBooking.setId(sampleBookingId);
        sampleBooking.setBookedBy(username);
        sampleBooking.setDoctorId(UUID.randomUUID().toString());
        sampleBooking.setBookingClass("Standard");
        sampleBooking.setPrice(BigDecimal.valueOf(100.0));

        sampleUser = new User();
        sampleUser.setUsername(username);
        sampleUser.setEmail("test@example.com");
        sampleUser.setFirstname("John");
        sampleUser.setLastname("Doe");

        sampleDoctor = new Doctor();
        sampleDoctor.setId(UUID.fromString(sampleBooking.getDoctorId()));
        sampleDoctor.setName("Dr. Smith");
    }

    @Test
    public void testFetchMyBookings_Success() {
        // Arrange
        List<Booking> mockBookings = Collections.singletonList(sampleBooking);
        when(bookingRepository.findByStatusAndBookedBy(STATUS_ACTIVE, username))
                .thenReturn(mockBookings);

        // Act
        List<Booking> result = bookingService.fetchMyBookings(username);

        // Assert
        assertEquals(mockBookings, result);
        verify(bookingRepository).findByStatusAndBookedBy(STATUS_ACTIVE, username);
    }

    @Test
    public void testSaveBooking_Success() {
        // Arrange
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(sampleUser));
        when(doctorRepository.findById(any(UUID.class))).thenReturn(Optional.of(sampleDoctor));
        when(sqsService.sendSqsMessage(any())).thenReturn("Success");

        // Act
        ResponseModel response = bookingService.saveBooking(sampleBooking, username);

        // Assert
        assertEquals("Success", response.getStatus());
        assertEquals("Operation Successful", response.getMessage());
        assertNotNull(response.getCreationId());

        // Verify interactions
        verify(bookingRepository).save(any(Booking.class));
        verify(userRepository).findByUsername(username);
        verify(doctorRepository).findById(any(UUID.class));
        verify(sqsService).sendSqsMessage(any());
    }

    @Test
    public void testUpdateBooking_Success() {
        // Arrange
        Booking existingBooking = new Booking();
        existingBooking.setId(sampleBookingId);
        existingBooking.setBookedBy(username);

        when(bookingRepository.findById(sampleBookingId))
                .thenReturn(Optional.of(existingBooking));

        // Act
        ResponseModel response = bookingService.updateBooking(
                sampleBookingId, sampleBooking, username);

        // Assert
        assertEquals("Success", response.getStatus());
        assertEquals("Operation Successful", response.getMessage());

        // Verify interactions
        verify(bookingRepository).findById(sampleBookingId);
        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    public void testUpdateBooking_Unauthorized() {
        // Arrange
        Booking existingBooking = new Booking();
        existingBooking.setId(sampleBookingId);
        existingBooking.setBookedBy("differentuser@example.com");

        when(bookingRepository.findById(sampleBookingId))
                .thenReturn(Optional.of(existingBooking));

        // Act
        ResponseModel response = bookingService.updateBooking(
                sampleBookingId, sampleBooking, username);

        // Assert
        assertEquals("Unsuccessful", response.getStatus());
        assertEquals("Operation Unsuccessful : Not Authorized To Update This Property", response.getMessage());

        // Verify interactions
        verify(bookingRepository).findById(sampleBookingId);
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    public void testInactiveProperty_Success() {
        // Arrange
        Booking existingBooking = new Booking();
        existingBooking.setId(sampleBookingId);
        existingBooking.setBookedBy(username);
        existingBooking.setStatus(STATUS_ACTIVE);

        when(bookingRepository.findById(sampleBookingId))
                .thenReturn(Optional.of(existingBooking));

        // Act
        ResponseModel response = bookingService.inactiveProperty(sampleBookingId, username);

        // Assert
        assertEquals("Success", response.getStatus());
        assertEquals("Operation Successful", response.getMessage());
        assertEquals(STATUS_INACTIVE, existingBooking.getStatus());

        // Verify interactions
        verify(bookingRepository).findById(sampleBookingId);
        verify(bookingRepository).save(existingBooking);
    }

    @Test
    public void testInactiveProperty_Unauthorized() {
        // Arrange
        Booking existingBooking = new Booking();
        existingBooking.setId(sampleBookingId);
        existingBooking.setBookedBy("differentuser@example.com");

        when(bookingRepository.findById(sampleBookingId))
                .thenReturn(Optional.of(existingBooking));

        // Act
        ResponseModel response = bookingService.inactiveProperty(sampleBookingId, username);

        // Assert
        assertEquals("Unsuccessful", response.getStatus());
        assertEquals("Operation Unsuccessful : Not Authorized To Update This Property", response.getMessage());

        // Verify interactions
        verify(bookingRepository).findById(sampleBookingId);
        verify(bookingRepository, never()).save(any(Booking.class));
    }
}