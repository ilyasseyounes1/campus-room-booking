package com.room.backend.reservation;

import com.room.backend.auth.User;
import com.room.backend.auth.UserRepository;
import com.room.backend.reservation.dto.ReservationRequest;
import com.room.backend.reservation.dto.ReservationResponse;
import com.room.backend.salle.Salle;
import com.room.backend.salle.SalleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final SalleRepository salleRepository;
    private final UserRepository userRepository;

    public List<ReservationResponse> getAll() {
        return reservationRepository.findAll().stream()
                .map(ReservationResponse::from)
                .toList();
    }

    public ReservationResponse getById(Long id) {
        return ReservationResponse.from(find(id));
    }

    public List<ReservationResponse> getMine(String email) {
        return reservationRepository.findByUserEmailOrderByDateDescHeureDebutDesc(email).stream()
                .map(ReservationResponse::from)
                .toList();
    }

    public ReservationResponse create(ReservationRequest request, String email) {
        validateTimes(request.getHeureDebut(), request.getHeureFin());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Salle salle = salleRepository.findById(request.getSalleId())
                .orElseThrow(() -> new RuntimeException("Salle not found: " + request.getSalleId()));

        if (!salle.isDisponible()) {
            throw new RuntimeException("Salle indisponible");
        }

        ensureNoConflict(request.getSalleId(), request.getDate(),
                request.getHeureDebut(), request.getHeureFin(), null);

        Reservation reservation = Reservation.builder()
                .user(user)
                .salle(salle)
                .date(request.getDate())
                .heureDebut(request.getHeureDebut())
                .heureFin(request.getHeureFin())
                .motif(request.getMotif())
                .statut(Statut.CONFIRMEE)
                .build();

        return ReservationResponse.from(reservationRepository.save(reservation));
    }

    public ReservationResponse update(Long id, ReservationRequest request) {
        validateTimes(request.getHeureDebut(), request.getHeureFin());

        Reservation reservation = find(id);

        Salle salle = salleRepository.findById(request.getSalleId())
                .orElseThrow(() -> new RuntimeException("Salle not found: " + request.getSalleId()));

        ensureNoConflict(request.getSalleId(), request.getDate(),
                request.getHeureDebut(), request.getHeureFin(), id);

        reservation.setSalle(salle);
        reservation.setDate(request.getDate());
        reservation.setHeureDebut(request.getHeureDebut());
        reservation.setHeureFin(request.getHeureFin());
        reservation.setMotif(request.getMotif());

        return ReservationResponse.from(reservationRepository.save(reservation));
    }

    public void delete(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reservation not found: " + id);
        }
        reservationRepository.deleteById(id);
    }

    public boolean isOwner(Long id, String email) {
        return reservationRepository.findById(id)
                .map(r -> r.getUser().getEmail().equals(email))
                .orElse(false);
    }

    private Reservation find(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found: " + id));
    }

    private void validateTimes(LocalTime debut, LocalTime fin) {
        if (debut == null || fin == null || !debut.isBefore(fin)) {
            throw new RuntimeException("heureDebut must be before heureFin");
        }
    }

    private void ensureNoConflict(Long salleId, LocalDate date,
                                  LocalTime debut, LocalTime fin,
                                  Long excludeId) {
        List<Reservation> conflicts = reservationRepository.findConflicts(salleId, date, debut, fin, excludeId);
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Conflit de réservation pour cette salle et ce créneau");
        }
    }
}
