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

  public Map<String, Object> getPrediction(Map<String,Object> data){
    // Get traffic volume prediction
    Map<String, Object> volumePrediction = getPredictionVolume(data);

    if (volumePrediction == null || !volumePrediction.containsKey("prediction")) {
      System.err.println("Prediction volume is null or missing 'prediction' key.");
      return null; // ou throw une exception personnalisée
    }

    Object trafficVolume = volumePrediction.get("prediction");

    String trafficLevel;
    if (trafficVolume instanceof Number) {
      double volume = ((Number) trafficVolume).doubleValue();
      if (volume < 200) {
        trafficLevel = "low";
      } else if (volume < 500) {
        trafficLevel = "medium";
      } else {
        trafficLevel = "high";
      }
    } else {
      trafficLevel = "medium"; // fallback
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
    System.out.println(data);
    Map<String, Object> formattedData = new LinkedHashMap<>();
    formattedData.put("temp", new Object[]{data.get("temp")});
    formattedData.put("rain_1h", new Object[]{0.0});
    formattedData.put("snow_1h", new Object[]{0.0});
    formattedData.put("clouds_all", new Object[]{data.get("clouds_all")});
    formattedData.put("hour", new Object[]{data.get("hour")});
    formattedData.put("day_of_week", new Object[]{data.get("day_of_week")});
    formattedData.put("month", new Object[]{data.get("month")});
    formattedData.put("is_holiday", new Object[]{data.get("is_holiday")});
    formattedData.put("weather_main_Clouds", new Object[]{data.get("weather_main_Clouds")});
    formattedData.put("weather_main_Drizzle", new Object[]{data.get("weather_main_Drizzle")});
    formattedData.put("weather_main_Fog", new Object[]{data.get("weather_main_Fog")});
    formattedData.put("weather_main_Haze", new Object[]{data.get("weather_main_Haze")});
    formattedData.put("weather_main_Mist", new Object[]{data.get("weather_main_Mist")});
    formattedData.put("weather_main_Rain", new Object[]{data.get("weather_main_Rain")});
    formattedData.put("weather_main_Smoke", new Object[]{data.get("weather_main_Smoke")});
    formattedData.put("weather_main_Snow", new Object[]{data.get("weather_main_Snow")});
    formattedData.put("weather_main_Squall", new Object[]{data.get("weather_main_Squall")});
    formattedData.put("weather_main_Thunderstorm", new Object[]{data.get("weather_main_Thunderstorm")});
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
      formattedData.put(key, new Object[]{data.getOrDefault(key, false)});
    }
    formattedData.put("traffic_volume_lag1", new Object[]{1800.0});
    formattedData.put("traffic_volume_lag2", new Object[]{1700.0});
    formattedData.put("year", new Object[]{data.get("year")});
    formattedData.put("day_of_month", new Object[]{data.get("day_of_month")});
    formattedData.put("road_km", new Object[]{data.get("road_km")});
    formattedData.put("road_width", new Object[]{0.0086});
    Map<String, Object> response = restTemplate.postForObject(flaskUrl + "Volume", formattedData, Map.class);
    System.out.println("Response from /predictVolume: " + response);
    //data filled here is from imagination we should make sure that we get some (we cannot get all of that data )data to replace the data here ,i need the road distance and width also
    return response;
  }

}
