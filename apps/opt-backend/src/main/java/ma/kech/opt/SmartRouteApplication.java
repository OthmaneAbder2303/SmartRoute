package ma.kech.opt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//@SpringBootApplication(scanBasePackages = "ma.kech.opt.config") // mn lhna 7lit lmouchkil dyal autowiring of passwordEncoder
																// pacque je dois spécifier mnin khassou y scanni l bean
@SpringBootApplication
public class SmartRouteApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartRouteApplication.class, args);
	}

}
