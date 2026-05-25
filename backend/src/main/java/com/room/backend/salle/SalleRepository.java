package com.room.backend.salle;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface SalleRepository extends JpaRepository<Salle, Long> {

    List<Salle> findByDisponibleTrue();

    List<Salle> findByNomContainingIgnoreCase(String nom);

    @Query("SELECT s FROM Salle s WHERE s.disponible = true " +
           "AND NOT EXISTS (" +
           "  SELECT r FROM Reservation r " +
           "  WHERE r.salle = s " +
           "  AND r.date = :date " +
           "  AND r.statut <> com.room.backend.reservation.Statut.ANNULEE " +
           "  AND r.heureDebut < :heureFin " +
           "  AND r.heureFin > :heureDebut" +
           ")")
    List<Salle> findAvailableForSlot(@Param("date") LocalDate date,
                                     @Param("heureDebut") LocalTime heureDebut,
                                     @Param("heureFin") LocalTime heureFin);
}