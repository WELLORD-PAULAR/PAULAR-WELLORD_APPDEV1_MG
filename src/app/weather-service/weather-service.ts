import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// WeatherStack API response types (https://weatherstack.com/documentation)
export interface WeatherStackResponse {
  request?: {
    type: string;
    query: string;
    language: string;
    unit: string;
  };
  location?: {
    name: string;
    country: string;
    region: string;
    lat: string;
    lon: string;
    timezone_id: string;
    localtime: string;
    localtime_epoch: number;
    utc_offset: string;
  };
  current?: {
    observation_time: string;
    temperature: number;
    weather_code: number;
    weather_icons: string[];
    weather_descriptions: string[];
    wind_speed: number;
    wind_degree: number;
    wind_dir: string;
    pressure: number;
    precip: number;
    humidity: number;
    cloudcover: number;
    feelslike: number;
    uv_index: number;
    visibility: number;
  };
  success?: boolean;
  error?: {
    code: number;
    type: string;
    info: string;
  };
}

export interface WeatherError {
  code: number;
  type: string;
  info: string;
}

const WEATHERSTACK_ERRORS: Record<number, string> = {
  404: 'City not found. Please check the spelling and try again.',
  101: 'Invalid API key. Please check your configuration.',
  102: 'API key disabled or unauthorized.',
  601: 'Too many requests. Please try again later.',
  615: 'API request quota exceeded.',
};

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '78bc8d7699b33ebdeb847824768ab8be';
  private apiURL = 'https://api.weatherstack.com/current';

  constructor(private http: HttpClient){}

  getWeather(city: string): Observable<WeatherStackResponse> {
    const url = `${this.apiURL}?access_key=${this.apiKey}&query=${encodeURIComponent(city)}`;
    return this.http.get<WeatherStackResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    // WeatherStack returns error details in the response body
    if (error.error?.error) {
      const weatherError = error.error.error as WeatherError;
      const message = WEATHERSTACK_ERRORS[weatherError.code] || weatherError.info;
      return throwError(() => new Error(message));
    }
    // Network or other errors
    return throwError(() => new Error('Failed to fetch weather. Please try again.'));
  }
}
