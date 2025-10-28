import { Injectable, signal, effect } from '@angular/core';
import { WeatherStackResponse } from '../weather-service/weather-service';

export interface CityWeather {
  cityName: string;
  weather: WeatherStackResponse;
  lastUpdated: Date;
}

const STORAGE_KEY = 'apollo_saved_cities';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private readonly cities = signal<CityWeather[]>(this.loadFromStorage());

  constructor() {
    // Set up effect to save to localStorage whenever cities change
    effect(() => {
      const currentCities = this.cities();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentCities));
    });
  }

  private loadFromStorage(): CityWeather[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const cities = JSON.parse(stored);
      // Convert string dates back to Date objects
      return cities.map((city: any) => ({
        ...city,
        lastUpdated: new Date(city.lastUpdated)
      }));
    } catch (error) {
      console.error('Failed to load cities from storage:', error);
      return [];
    }
  }

  getCities() {
    return this.cities.asReadonly();
  }

  addCity(cityWeather: CityWeather) {
    this.cities.update(cities => {
      // Check if city already exists
      const index = cities.findIndex(c => c.cityName.toLowerCase() === cityWeather.cityName.toLowerCase());
      if (index !== -1) {
        // Update existing city
        const updatedCities = [...cities];
        updatedCities[index] = cityWeather;
        return updatedCities;
      }
      // Add new city
      return [...cities, cityWeather];
    });
  }

  removeCity(cityName: string) {
    this.cities.update(cities =>
      cities.filter(city => city.cityName.toLowerCase() !== cityName.toLowerCase())
    );
  }

  updateCityWeather(cityName: string, weather: WeatherStackResponse) {
    this.addCity({
      cityName,
      weather,
      lastUpdated: new Date()
    });
  }
}
