package com.nci.skeleton.service;

import com.nci.skeleton.model.MasterData;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MasterDataService {
    public static MasterData data;

    static {
        try {
            data = new MasterData();

            data.setSpeciality(List.of("Ophthalmologist","Pediatrician","Neurologist","psychiatrist",
                    "Dermatologist","Oncologist","Cardiologist","Immunologist",
                    "General Practitioner","Urologist","Orthopedist","Rheumatologist","Hematologist","Nephrologist","Orthodontist"));
            data.setBookingClass(List.of("GENERAL (15 Minutes)","PREMIUM (30 Minutes)","EMERGENCY"));
        } catch (Exception ex) {
            System.out.println(ex.getLocalizedMessage());
        }
    }
    public MasterData fetchMasterData() {
        return data;
    }
}
