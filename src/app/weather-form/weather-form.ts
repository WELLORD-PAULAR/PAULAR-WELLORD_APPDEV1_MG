import { Component, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-form',
  templateUrl: './weather-form.html',
  styleUrl: './weather-form.css',
  imports: [CommonModule],
})
export class WeatherForm {
  @Output() add = new EventEmitter<string>();

  error = signal<string | null>(null);
  loading = signal(false);

  onAdd(input: HTMLInputElement) {
    const cityName = (input.value || '').trim();
    if (!cityName) {
      this.error.set('Please enter a city name');
      return;
    }

    this.error.set(null);
    this.loading.set(true);
    this.add.emit(cityName);

    // Reset loading after a short delay
    setTimeout(() => this.loading.set(false), 1000);
    input.value = '';
  }
}
