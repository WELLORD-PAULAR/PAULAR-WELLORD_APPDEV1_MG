import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-form',
  templateUrl: './weather-form.html',
  styleUrl: './weather-form.css',
  imports: [CommonModule],
})
export class WeatherForm {
  @Output() add = new EventEmitter<string>();

  onAdd(input: HTMLInputElement) {
    const v = (input.value || '').trim();
    if (!v) return;
    this.add.emit(v);
    input.value = '';
  }
}
