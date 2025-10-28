import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CityService } from '../city-service/city-service';

@Component({
  selector: 'app-city-list',
  imports: [CommonModule],
  templateUrl: './city-list.html',
  styleUrl: './city-list.css',
})
export class CityList {
  protected readonly cities = computed(() => this.cityService.getCities()());

  constructor(protected cityService: CityService) {}

  protected formatDate(date: Date) {
    return new Date(date).toLocaleString();
  }

  protected removeCity(cityName: string) {
    this.cityService.removeCity(cityName);
  }
}
