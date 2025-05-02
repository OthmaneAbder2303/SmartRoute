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
    Map<String, Object> formattedData = new HashMap<>();
    formattedData.put("Distance_km", new Object[]{10.0});
    formattedData.put("Weather", new Object[]{"clear"});
    formattedData.put("Speed_kmh", new Object[]{60});
    formattedData.put("Traffic", new Object[]{"low"});
    System.out.println(formattedData);
    return restTemplate.postForObject(flaskUrl, formattedData, Map.class);

  }


}
