package com.room.backend.salle;


import com.room.backend.salle.dto.SalleRequest;
import com.room.backend.salle.dto.SalleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalleService {

    private final SalleRepository salleRepository   ;

    public List<SalleResponse> getAll() {
        return salleRepository .findAll()
                .stream( )
                .map(SalleResponse::from)
                 .toList() ;
    }

    public SalleResponse getById   (Long id ) {
        Salle salle = salleRepository.findById( id)
                .orElseThrow(() -> new RuntimeException("aalle not found: " + id));
        return SalleResponse.from(salle) ;
    }

    public List<SalleResponse> getAvailable () {
        return salleRepository. findByDisponibleTrue()
                .stream( )
                .map(SalleResponse::from)
                .toList()   ;
    }

    public SalleResponse create(SalleRequest request) {
        Salle salle = Salle.builder()

                .nom(request.getNom())
                .capacite(request.getCapacite() )
                 .localisation(request.getLocalisation( ))
                .disponible(request.isDisponible() )
                .build();
        return SalleResponse.from(salleRepository.save(salle))  ;
    }

    public SalleResponse update(Long id, SalleRequest request) {
        Salle salle = salleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("salle not found ;" + id) );
        salle.setNom(request.getNom());
          salle.setCapacite(request.getCapacite ());
          salle. setLocalisation (request.getLocalisation()  );
          salle.setDisponible(request.isDisponible());
        return SalleResponse.from(  salleRepository.save(salle)) ;
    }

    public void delete(Long id )  {
        if ( !salleRepository.existsById(  id)) {
            throw new RuntimeException(" Salle not found : " + id) ;
        }
        salleRepository. deleteById(id ) ;
    }
}