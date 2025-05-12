package ma.kech.opt.service;

import ma.kech.opt.entity.FamousPlaces;
import ma.kech.opt.repository.FamousPlacesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class FamousPlacesServices {
  private final FamousPlacesRepository famousPlacesRepository;

  public FamousPlacesServices(FamousPlacesRepository famousPlacesRepository) {
    this.famousPlacesRepository = famousPlacesRepository;
  }

  public List<FamousPlaces> getPlaces() {
    return famousPlacesRepository.findAll();
  }
}
