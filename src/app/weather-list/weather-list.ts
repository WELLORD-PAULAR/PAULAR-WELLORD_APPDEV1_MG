import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-list',
  templateUrl: './weather-list.html',
  styleUrl: './weather-list.css',
  imports: [CommonModule],
})
export class WeatherList {
  @Input() items: any[] = [];
  @Input() selected: any | null = null;
  @Output() select = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();

  onSelect(item: any) { this.select.emit(item); }
  onRemove(item: any, event?: Event) { if (event) event.stopPropagation(); this.remove.emit(item); }
}
