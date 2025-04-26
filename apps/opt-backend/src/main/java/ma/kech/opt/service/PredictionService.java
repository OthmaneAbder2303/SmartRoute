package ma.kech.opt.service;


import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PredictionService {
  private String flaskUrl= "http://localhost:5000/predict";
  private final RestTemplate restTemplate;
  // we also need to add the apis to the weather and the call of the traffic_volume prediction
  public PredictionService(RestTemplate restTemplate){
    this.restTemplate=restTemplate;
  }

  public Map<String,Object> getPrediction( Map<String,Object> data){
    Map<String, Object> testData = new HashMap<>();
    testData.put("Distance_km", 10.0);
    testData.put("Weather", "clear");
    testData.put("Speed_kmh", 60);
    testData.put("Traffic", "low");
    return restTemplate.postForObject(flaskUrl, testData, Map.class);

  }

}
