package com.room.backend.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserEmailOrderByDateDescHeureDebutDesc(String email);

    List<Reservation> findBySalleIdAndDate(Long salleId, LocalDate date);

    @Query("SELECT r FROM Reservation r " +
           "WHERE r.salle.id = :salleId " +
           "AND r.date = :date " +
           "AND r.statut <> com.room.backend.reservation.Statut.ANNULEE " +
           "AND r.heureDebut < :heureFin " +
           "AND r.heureFin > :heureDebut " +
           "AND (:excludeId IS NULL OR r.id <> :excludeId)")
    List<Reservation> findConflicts(@Param("salleId") Long salleId,
                                    @Param("date") LocalDate date,
                                    @Param("heureDebut") LocalTime heureDebut,
                                    @Param("heureFin") LocalTime heureFin,
                                    @Param("excludeId") Long excludeId);
}
