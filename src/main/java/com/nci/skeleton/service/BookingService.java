package com.nci.skeleton.service;

import com.google.gson.Gson;
import com.nci.skeleton.entity.Booking;
import com.nci.skeleton.entity.Doctor;
import com.nci.skeleton.model.ResponseModel;
import com.nci.skeleton.repository.BookingRepository;
import com.nci.skeleton.repository.DoctorRepository;
import com.nci.skeleton.repository.UserRepository;
import com.nci.skeleton.security.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import static com.nci.skeleton.config.Constants.STATUS_ACTIVE;
import static com.nci.skeleton.config.Constants.STATUS_INACTIVE;
import static java.util.Objects.nonNull;

@Service
public class BookingService {

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    DoctorRepository doctorRepository;
    @Autowired
    UserRepository userRepository;

    @Autowired
    SQSService sqsService;

    public List<Booking> fetchMyBookings(String userId) {
        return bookingRepository.findByStatusAndBookedBy(STATUS_ACTIVE, userId);
    }

    public ResponseModel saveBooking(Booking booking, String userName) {
        ResponseModel response = new ResponseModel();
        try {
            booking.setId(UUID.randomUUID());
            booking.setStatus(STATUS_ACTIVE);
            booking.setBookedOn(LocalDateTime.now());
            booking.setBookedBy(userName);
            booking.setBookingClass(booking.getBookingClass());
            booking.setPrice(booking.getPrice());
            bookingRepository.save(booking);
            User enquiryUser = userRepository.findByUsername(userName).orElse(new User());
            Doctor doctor = doctorRepository.findById(UUID.fromString(booking.getDoctorId())).orElse(new Doctor());
            sendEmail(enquiryUser, booking, doctor);
            response.setStatus("Success");
            response.setMessage("Operation Successful");
            response.setCreationId(booking.getId().toString());
        } catch (Exception e) {
            response.setException(e.getLocalizedMessage());
        }
        return response;
    }

    public ResponseModel updateBooking(UUID propertyId, Booking booking, String userName) {
        ResponseModel response = new ResponseModel();
        try {
            bookingRepository.findById(propertyId).ifPresent(
                    savedBooking -> {
                        if (savedBooking.getBookedBy().equals(userName)) {
                            setUpdatedValues(savedBooking, booking);
                            bookingRepository.save(savedBooking);
                            response.setStatus("Success");
                            response.setMessage("Operation Successful");
                        } else {
                            response.setStatus("Unsuccessful");
                            response.setMessage("Operation Unsuccessful : Not Authorized To Update This Property");
                        }
                    }
            );
        } catch (Exception e) {
            response.setStatus("Unsuccessful");
            response.setMessage("Exception Occurred");
            response.setException(e.getLocalizedMessage());
        }
        return response;
    }

    private void setUpdatedValues(Booking booking, Booking updatedProp) {
        if (nonNull(updatedProp.getBookingClass()))
            booking.setBookingClass(updatedProp.getBookingClass());
        if (nonNull(updatedProp.getPrice()))
            booking.setPrice(updatedProp.getPrice());
        booking.setModifiedOn(LocalDateTime.now());
    }

    public ResponseModel inactiveProperty(UUID bookingId, String userName) {
        ResponseModel response = new ResponseModel();
        try {
            bookingRepository.findById(bookingId).ifPresent(
                    savedBooking -> {
                        if (savedBooking.getBookedBy().equals(userName)) {
                            savedBooking.setStatus(STATUS_INACTIVE);
                            bookingRepository.save(savedBooking);
                            response.setStatus("Success");
                            response.setMessage("Operation Successful");
                        } else {
                            response.setStatus("Unsuccessful");
                            response.setMessage("Operation Unsuccessful : Not Authorized To Update This Property");
                        }
                    }
            );
        } catch (Exception e) {
            response.setStatus("Unsuccessful");
            response.setMessage("Exception Occurred");
            response.setException(e.getLocalizedMessage());
        }
        return response;
    }

    public void sendEmail(User productUser, Booking booking, Doctor doctor) {

        String messageBody = new Gson().toJson(new HashMap<String, String>() {{
            put("recipient", productUser.getEmail());
            put("body", "Congratulations, " + productUser.getFirstname() + "! Your appointment has been booked successfully!\n" +
                    "\n" +
                    "We are pleased to confirm your Doctor reservation. Below are the details of your booking:\n" +
                    "\n" +
                    "- **Doctor Name:** " + doctor.getName() + "\n" +
                    "- **Patient Name(s):** " + productUser.getFirstname() + " " + productUser.getLastname() + "\n" +
                    "- **Booking Reference:** " + booking.getId() + "\n" +
                    "\n" +
                    "You will receive a confirmation email shortly with all the details regarding your appointment. Please check your inbox, and remember to check your spam or junk folder if you do not see the email.\n" +
                    "\n" +
                    "\n\n" +
                    "\n" +
                    "If you have any questions or need assistance, feel free to contact our customer support team at +353 899 999 999.\n" +
                    "\n" +
                    "Thank you for choosing Practo! We look forward to serving you.\n" +
                    "\n" +
                    "Best regards,  \n" +
                    "- Team Practo\n");
            put("subject", "Congratulations! Your Doctor Appointment Has Been Booked...");
        }});

        sqsService.sendSqsMessage(messageBody);
    }
}
