package com.room.backend.salle;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "salles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Salle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false )
    private String  nom;

    @Column (nullable = false)
    private int capacite ;

    @Column(nullable = false)
    private String localisation;

    @Column(nullable = false)
    private boolean disponible = true;
}