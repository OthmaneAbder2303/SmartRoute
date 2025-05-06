package ma.kech.opt.controller;


import ma.kech.opt.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
    return predictionService.getPredictionVolume(requestData);
  }
  @PostMapping("/Route")
  public Map<String, Object> getRoute(@RequestBody Map<String, Object> requestData){
    System.out.println("route received: " + requestData);
    Map<String, Double> start = (Map<String, Double>) requestData.get("start");
    Map<String, Double> end = (Map<String, Double>) requestData.get("end");
    List<Map<String, Double>> route = new ArrayList<>();
    route.add(Map.of("lat", start.get("lat"), "lng", start.get("lng")));
    route.add(Map.of("lat", 31.630, "lng", -7.990));
    route.add(Map.of("lat", end.get("lat"), "lng", end.get("lng")));
    Map<String, Object> response = new HashMap<>();
    response.put("route", route);
    return response;
  }
}
