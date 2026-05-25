package com.room.backend.salle.dto;


import lombok.Data;

@Data
public class SalleRequest {
    private String nom ;
    private int capacite;
    private String  localisation;
    private boolean disponible ;
}