package com.room.backend.salle.dto;


import com.room.backend.salle.Salle;
import lombok.Data;

@Data
public class SalleResponse {
    private Long id ;
    private String nom;
    private int  capacite ;
    private String localisation;
     private boolean disponible;

    public static SalleResponse from(Salle s) {
        SalleResponse r = new SalleResponse();
         r.setId(s.getId());
        r.setNom(s. getNom());
        r.setCapacite(s.getCapacite());
        r.setLocalisation(s.getLocalisation ());
         r.setDisponible(s.isDisponible())  ;
        return r;
    }
}