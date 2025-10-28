import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WeatherForm } from '../weather-form/weather-form';
import { WeatherService } from '../weather-service/weather-service';
import { CityService } from '../city-service/city-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, WeatherForm, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(
    private weatherService: WeatherService,
    private cityService: CityService,
    private router: Router
  ) {}

  onAddCity(city: string) {
    if (!city.trim()) return;

    this.weatherService.getWeather(city).subscribe({
      next: (weatherData) => {
        if (weatherData.error) {
          console.error('Weather API Error:', weatherData.error.info);
          return;
        }

        this.cityService.updateCityWeather(
          weatherData.location?.name ?? city,
          weatherData
        );

        // Navigate to cities list after successful addition
        this.router.navigate(['/cities']);
      },
      error: (error) => {
        console.error('Failed to fetch weather:', error);
      }
    });
  }
}
