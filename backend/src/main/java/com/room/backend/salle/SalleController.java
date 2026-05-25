package com.room.backend.salle;


import com.room.backend.salle.dto.SalleRequest;
import com.room.backend.salle.dto.SalleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salles")
@RequiredArgsConstructor
public class SalleController {

    private final SalleService salleService ;

    @GetMapping
    public  ResponseEntity <List< SalleResponse> > getAll () {
        return ResponseEntity.ok(salleService. getAll() );
    }

    @GetMapping("/{id}")
    public ResponseEntity< SalleResponse> getById( @PathVariable Long id) {
         return ResponseEntity.
                ok(salleService.getById(id)) ;
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<SalleResponse>  > getAvailable( ) {
        return ResponseEntity.ok(salleService. getAvailable( ))  ;
    }

    @PostMapping
    @PreAuthorize ("hasRole('ADMIN')")
    public ResponseEntity<SalleResponse> create(@RequestBody SalleRequest request) {
        return  ResponseEntity.ok(salleService.create( request));
    }

    @PutMapping("/{id}")

    @PreAuthorize("hasRole('ADMIN')" )
    public ResponseEntity<SalleResponse > update(@PathVariable Long id ,
                                                @RequestBody SalleRequest request ) {
        return ResponseEntity.ok(salleService .update( id, request));
    }

    @DeleteMapping("/{id}" )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity< Void> delete  (@PathVariable Long id) {
         salleService. delete(id);
        return ResponseEntity.noContent().build();
    }
}