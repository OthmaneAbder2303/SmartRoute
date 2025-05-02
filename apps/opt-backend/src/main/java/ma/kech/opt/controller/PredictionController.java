package ma.kech.opt.controller;


import ma.kech.opt.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/predict")
public class PredictionController {

  private final PredictionService predictionService;

  @Autowired
  public PredictionController(PredictionService predictionService) {
    this.predictionService = predictionService;
  }
  @PostMapping("/predictTime")
  public Map<String, Object> predictTime(@RequestBody Map<String, Object> requestData){
        //Map :pour que la requet soit en Map format
    return predictionService.getPrediction(requestData);
  }
  @PostMapping
  public Map<String, Object> predict(@RequestBody Map<String, Object> requestData){
    return predictionService.getPrediction(requestData);
  }

}
