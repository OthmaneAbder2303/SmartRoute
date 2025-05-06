package ma.kech.opt.service;


import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class PredictionService {
  private String flaskUrl= "http://localhost:5000/predict";
  private final RestTemplate restTemplate;

  // we also need to add the apis to the weather and the call of the traffic_volume prediction
  public PredictionService(RestTemplate restTemplate){
    this.restTemplate=restTemplate;
  }

  public Map<String,Object> getPrediction(Map<String,Object> data){
    // Get traffic volume prediction
    Map<String, Object> volumePrediction = getPredictionVolume(data);
    Object trafficVolume = volumePrediction.get("prediction");

    String trafficLevel;
    if (trafficVolume instanceof Number) {
      double volume = ((Number) trafficVolume).doubleValue();
      if (volume < 2000) {
        trafficLevel = "low";
      } else if (volume < 4000) {
        trafficLevel = "medium";
      } else {
        trafficLevel = "high";
      }
    } else {
      trafficLevel = "medium"; //chwia Hriiff :)
    }
    Map<String, Object> formattedData = new HashMap<>();
    formattedData.put("Distance_km", new Object[]{data.get("Distance_km")});
    formattedData.put("Weather", new Object[]{data.get("Weather")});
    formattedData.put("Speed_kmh", new Object[]{data.get("Speed_kmh")});
    formattedData.put("Traffic", new Object[]{trafficLevel});

    System.out.println("Formatted Data for Prediction: " + formattedData);
    return restTemplate.postForObject(flaskUrl, formattedData, Map.class);
  }



  public Map<String, Object> getPredictionVolume(Map<String, Object> data) {
    Map<String, Object> formattedData = new LinkedHashMap<>();
    formattedData.put("temp", new Object[]{25.32});
    formattedData.put("rain_1h", new Object[]{10.0});
    formattedData.put("snow_1h", new Object[]{0.0});
    formattedData.put("clouds_all", new Object[]{75});
    formattedData.put("hour", new Object[]{19});
    formattedData.put("day_of_week", new Object[]{2});
    formattedData.put("month", new Object[]{8});
    formattedData.put("is_holiday", new Object[]{0});
    formattedData.put("weather_main_Clouds", new Object[]{true});
    formattedData.put("weather_main_Drizzle", new Object[]{false});
    formattedData.put("weather_main_Fog", new Object[]{false});
    formattedData.put("weather_main_Haze", new Object[]{false});
    formattedData.put("weather_main_Mist", new Object[]{false});
    formattedData.put("weather_main_Rain", new Object[]{false});
    formattedData.put("weather_main_Smoke", new Object[]{false});
    formattedData.put("weather_main_Snow", new Object[]{true});
    formattedData.put("weather_main_Squall", new Object[]{false});
    formattedData.put("weather_main_Thunderstorm", new Object[]{false});
    String[] descriptions = {
      "Sky is Clear", "broken clouds", "drizzle", "few clouds", "fog",
      "freezing rain", "haze", "heavy intensity drizzle", "heavy intensity rain", "heavy snow",
      "light intensity drizzle", "light intensity shower rain", "light rain", "light rain and snow",
      "light shower snow", "light snow", "mist", "moderate rain", "overcast clouds",
      "proximity shower rain", "proximity thunderstorm", "proximity thunderstorm with drizzle",
      "proximity thunderstorm with rain", "scattered clouds", "shower drizzle", "shower snow",
      "sky is clear", "sleet", "smoke", "snow", "thunderstorm", "thunderstorm with drizzle",
      "thunderstorm with heavy rain", "thunderstorm with light drizzle", "thunderstorm with light rain",
      "thunderstorm with rain", "very heavy rain"
    };
    for (String desc : descriptions) {
      String key = "weather_description_" + desc;
      if (desc.equals("broken clouds")) {
        formattedData.put(key, new Object[]{true});
      } else {
        formattedData.put(key, new Object[]{false});
      }
    }
    formattedData.put("traffic_volume_lag1", new Object[]{1800.0});
    formattedData.put("traffic_volume_lag2", new Object[]{1700.0});
    formattedData.put("year", new Object[]{2018});
    formattedData.put("day_of_month", new Object[]{1});
    formattedData.put("road_km", 10.0);
    formattedData.put("road_width", 0.01);
    //data filled here is from imagination we should make sure that we get some (we cannot get all of that data )data to replace the data here ,i need the road distance and width also
    return restTemplate.postForObject(flaskUrl+"Volume", formattedData, Map.class);
  }

}
