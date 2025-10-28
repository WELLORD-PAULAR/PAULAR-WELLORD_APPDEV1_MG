import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CityList } from './city-list/city-list';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'cities', component: CityList },
];
