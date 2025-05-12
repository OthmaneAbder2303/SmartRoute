package ma.kech.opt.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class PredictionServiceTest {

  private RestTemplate restTemplate;
  private PredictionService predictionService;

  @BeforeEach
  public void setUp() {
    restTemplate = mock(RestTemplate.class);
    predictionService = new PredictionService(restTemplate);
  }

  private Map<String, Object> baseData() {
    Map<String, Object> data = new HashMap<>();
    data.put("Distance_km", 10.0);
    data.put("Weather", "Clear");
    data.put("Speed_kmh", 60.0);
    data.put("temp", 25.0);
    data.put("clouds_all", 20);
    data.put("hour", 10);
    data.put("day_of_week", 3);
    data.put("month", 5);
    data.put("is_holiday", false);
    data.put("weather_main_Clouds", false);
    data.put("weather_main_Rain", false);
    data.put("weather_main_Clear", true);
    data.put("weather_main_Fog", false);
    data.put("weather_main_Snow", false);
    data.put("weather_main_Thunderstorm", false);
    data.put("weather_main_Haze", false);
    data.put("weather_main_Smoke", false);
    data.put("weather_main_Drizzle", false);
    data.put("weather_main_Squall", false);
    data.put("weather_main_Mist", false);
    data.put("year", 2025);
    data.put("day_of_month", 10);
    data.put("road_km", 5.0);

    // Ajout des descriptions météo
    data.put("weather_description_clear sky", true);
    return data;
  }

  @Test
  public void testGetPrediction_LowTraffic() {
    Map<String, Object> inputData = baseData();

    Map<String, Object> volumeResponse = new HashMap<>();
    volumeResponse.put("prediction", 100.0); // low

    Map<String, Object> predictionResponse = Map.of("result", "safe");

    when(restTemplate.postForObject(contains("predictVolume"), any(), eq(Map.class))).thenReturn(volumeResponse);
    when(restTemplate.postForObject(eq("http://localhost:5000/predict"), any(), eq(Map.class))).thenReturn(predictionResponse);

    Map<String, Object> result = predictionService.getPrediction(inputData);
    assertNotNull(result);
    assertEquals("safe", result.get("result"));
  }

  @Test
  public void testGetPrediction_MediumTraffic() {
    Map<String, Object> inputData = baseData();

    Map<String, Object> volumeResponse = new HashMap<>();
    volumeResponse.put("prediction", 300.0); // medium

    when(restTemplate.postForObject(contains("predictVolume"), any(), eq(Map.class))).thenReturn(volumeResponse);
    when(restTemplate.postForObject(eq("http://localhost:5000/predict"), any(), eq(Map.class))).thenReturn(Map.of("result", "ok"));

    Map<String, Object> result = predictionService.getPrediction(inputData);
    assertEquals("ok", result.get("result"));
  }

  @Test
  public void testGetPrediction_HighTraffic() {
    Map<String, Object> inputData = baseData();

    Map<String, Object> volumeResponse = new HashMap<>();
    volumeResponse.put("prediction", 800.0); // high

    when(restTemplate.postForObject(contains("predictVolume"), any(), eq(Map.class))).thenReturn(volumeResponse);
    when(restTemplate.postForObject(eq("http://localhost:5000/predict"), any(), eq(Map.class))).thenReturn(Map.of("result", "delay"));

    Map<String, Object> result = predictionService.getPrediction(inputData);
    assertEquals("delay", result.get("result"));
  }

  @Test
  public void testGetPrediction_InvalidVolume() {
    Map<String, Object> inputData = baseData();

    Map<String, Object> volumeResponse = new HashMap<>();
    volumeResponse.put("prediction", "unknown"); // Not a number

    when(restTemplate.postForObject(contains("predictVolume"), any(), eq(Map.class))).thenReturn(volumeResponse);
    when(restTemplate.postForObject(eq("http://localhost:5000/predict"), any(), eq(Map.class))).thenReturn(Map.of("result", "default"));

    Map<String, Object> result = predictionService.getPrediction(inputData);
    assertEquals("default", result.get("result"));
  }

  @Test
  public void testGetPredictionVolume_ValidResponse() {
    Map<String, Object> inputData = baseData();
    Map<String, Object> expectedResponse = Map.of("prediction", 123.45);

    when(restTemplate.postForObject(contains("predictVolume"), any(), eq(Map.class)))
      .thenReturn(expectedResponse);

    Map<String, Object> result = predictionService.getPredictionVolume(inputData);

    assertNotNull(result);
    assertEquals(123.45, result.get("prediction"));
  }

  @Test
  public void testGetPrediction_NullResponse() {
    Map<String, Object> inputData = baseData();

    when(restTemplate.postForObject(anyString(), any(), eq(Map.class))).thenReturn(null);

    Map<String, Object> result = predictionService.getPrediction(inputData);
    assertNull(result); // rah j'ai géré le null f la fonction de base
  }

  @Test
  public void testGetPrediction_RestClientException() {
    Map<String, Object> inputData = baseData();

    when(restTemplate.postForObject(anyString(), any(), eq(Map.class)))
      .thenThrow(new RestClientException("Erreur de connexion"));

    assertThrows(RestClientException.class, () -> {
      predictionService.getPrediction(inputData);
    });
  }
}
