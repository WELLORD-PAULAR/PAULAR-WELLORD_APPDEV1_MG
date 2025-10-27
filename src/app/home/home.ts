import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { WeatherService } from '../weather-service/weather-service';
import { firstValueFrom } from 'rxjs';
import { WeatherForm } from '../weather-form/weather-form';
import { WeatherList } from '../weather-list/weather-list';

interface WeatherEntry {
  city: string;
  temperature: number | null;
  description?: string;
  icon?: string | null;
  time?: string;
  raw?: any;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, JsonPipe, WeatherForm, WeatherList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  list: WeatherEntry[] = [];
  filteredList: WeatherEntry[] = [];
  selected: WeatherEntry | null = null;



  onFilter(q: string) {
    const query = (q || '').trim().toLowerCase();
    if (!query) {
      this.filteredList = this.list;
      return;
    }
    this.filteredList = this.list.filter(i => i.city.toLowerCase().includes(query));
  }

  select(item: WeatherEntry) {
    this.selected = item;
  }

  remove(item: WeatherEntry, event?: Event) {
    if (event) event.stopPropagation();
    this.list = this.list.filter(i => i !== item);
    this.filteredList = this.list;
    if (this.selected === item) this.selected = this.list[0] || null;
  }

  constructor(private weatherService: WeatherService) {
    // seed with an example so the page looks populated in demos
    this.list = [];
    this.filteredList = this.list;
  }

  async addCity(city: string | null | undefined) {
    const name = (city || '').trim();
    if (!name) return;

    try {
      // use the WeatherService which returns an Observable
      const data = await firstValueFrom(this.weatherService.getWeather(name));
      const entry: WeatherEntry = {
        city: data.location?.name ?? name,
        temperature: data.current?.temperature ?? null,
        description: data.current?.weather_descriptions?.[0] ?? '',
        icon: data.current?.weather_icons?.[0] ?? null,
        time: data.location?.localtime ?? new Date().toLocaleString(),
        raw: data,
      };

      const exists = this.list.find(i => i.city.toLowerCase() === entry.city.toLowerCase());
      if (!exists) this.list.unshift(entry); else Object.assign(exists, entry);
      this.filteredList = this.list;
      this.selected = entry;
    } catch (err) {
      console.error('Weather fetch failed', err);
      // fallback mocked entry so UX remains functional
      const mock: WeatherEntry = {
        city: name,
        temperature: Math.round(5 + Math.random() * 20),
        description: 'Mocked clear sky (offline)',
        icon: null,
        time: new Date().toLocaleString(),
        raw: { error: true }
      };
      this.list.unshift(mock);
      this.filteredList = this.list;
      this.selected = mock;
    }
  }
}
