package ma.kech.opt.repository;

import ma.kech.opt.entity.FamousPlaces;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FamousPlacesRepository extends JpaRepository<FamousPlaces,Integer> {
}
