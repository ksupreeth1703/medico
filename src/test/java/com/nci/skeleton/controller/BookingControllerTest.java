package com.nci.skeleton.controller;

import com.nci.skeleton.entity.Booking;
import com.nci.skeleton.model.ResponseModel;
import com.nci.skeleton.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingControllerTest {

    @Mock
    private BookingService bookingService;

    @Mock
    private Principal principal;

    @InjectMocks
    private BookingController bookingController;

    private Booking sampleBooking;
    private UUID sampleBookingId;
    private String username;

    @BeforeEach
    public void setUp() {
        // Prepare test data
        sampleBookingId = UUID.randomUUID();
        username = "testuser@example.com";
        sampleBooking = new Booking();
        sampleBooking.setId(sampleBookingId);

        // Setup principal mock
        when(principal.getName()).thenReturn(username);
    }

    @Test
    public void testGetConfirmedBookings_Success() {
        // Arrange
        List<Booking> mockBookings = Arrays.asList(sampleBooking);
        when(bookingService.fetchMyBookings(username)).thenReturn(mockBookings);

        // Act
        ResponseEntity<List<Booking>> response = bookingController.getConfirmedBookings(principal);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockBookings, response.getBody());
        verify(bookingService).fetchMyBookings(username);
    }

    @Test
    public void testBookDoctor_Success() {
        // Arrange
        ResponseModel expectedResponse = new ResponseModel();
        expectedResponse.setMessage("Booking successful");
        when(bookingService.saveBooking(sampleBooking, username)).thenReturn(expectedResponse);

        // Act
        ResponseEntity<ResponseModel> response = bookingController.bookDoctor(sampleBooking, principal);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
        verify(bookingService).saveBooking(sampleBooking, username);
    }

    @Test
    public void testUpdateBooking_Success() {
        // Arrange
        ResponseModel expectedResponse = new ResponseModel();
        expectedResponse.setMessage("Booking updated");
        when(bookingService.updateBooking(sampleBookingId, sampleBooking, username))
                .thenReturn(expectedResponse);

        // Act
        ResponseEntity<ResponseModel> response = bookingController.updateBooking(
                sampleBookingId, sampleBooking, principal);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
        verify(bookingService).updateBooking(sampleBookingId, sampleBooking, username);
    }

    @Test
    public void testDeleteBooking_Success() {
        // Arrange
        ResponseModel expectedResponse = new ResponseModel();
        expectedResponse.setMessage("Booking deleted");
        when(bookingService.inactiveProperty(sampleBookingId, username))
                .thenReturn(expectedResponse);

        // Act
        ResponseEntity<ResponseModel> response = bookingController.deleteBooking(
                sampleBookingId, principal);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
        verify(bookingService).inactiveProperty(sampleBookingId, username);
    }

    @Test
    public void testBookDoctor_NullBooking() {
        // Arrange
        Booking nullBooking = null;

        // Act & Assert
        try {
            bookingController.bookDoctor(nullBooking, principal);
        } catch (Exception e) {
            // Depending on your error handling strategy, you might want to
            // assert specific exception type or message
        }
    }

    @Test
    public void testUpdateBooking_InvalidBookingId() {
        // Arrange
        UUID invalidBookingId = null;

        // Act & Assert
        try {
            bookingController.updateBooking(invalidBookingId, sampleBooking, principal);
        } catch (Exception e) {
            // Verify error handling for invalid booking ID
        }
    }
}