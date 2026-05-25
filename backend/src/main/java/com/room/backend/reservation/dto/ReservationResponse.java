package com.room.backend.reservation.dto;

import com.room.backend.reservation.Reservation;
import com.room.backend.reservation.Statut;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long salleId;
    private String salleNom;
    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String motif;
    private Statut statut;

    public static ReservationResponse from(Reservation r) {
        return ReservationResponse.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .userName(r.getUser().getName())
                .userEmail(r.getUser().getEmail())
                .salleId(r.getSalle().getId())
                .salleNom(r.getSalle().getNom())
                .date(r.getDate())
                .heureDebut(r.getHeureDebut())
                .heureFin(r.getHeureFin())
                .motif(r.getMotif())
                .statut(r.getStatut())
                .build();
    }
}
