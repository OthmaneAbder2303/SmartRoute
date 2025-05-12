package ma.kech.opt.controller;

import ma.kech.opt.entity.FamousPlaces;
import ma.kech.opt.service.FamousPlacesServices;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/famousplaces")
public class FamousPlacesController {
  private final FamousPlacesServices famousPlacesServices;

  public FamousPlacesController(FamousPlacesServices famousPlacesServices) {
    this.famousPlacesServices = famousPlacesServices;
  }

  @GetMapping
  public List<FamousPlaces> getFamousPlaces(){
    return famousPlacesServices.getPlaces();
  }
}
