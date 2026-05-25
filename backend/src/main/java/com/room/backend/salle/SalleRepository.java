package com.room.backend.salle;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SalleRepository extends JpaRepository<Salle, Long > {
    List<Salle  > findByDisponibleTrue();
     List<Salle> findByNomContainingIgnoreCase( String nom);
}