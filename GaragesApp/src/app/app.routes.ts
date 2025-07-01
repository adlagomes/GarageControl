import { Routes } from '@angular/router';
import { GarageListComponent } from './components/garage-list/garage-list.component';
import { GarageFormComponent } from './components/garage-form/garage-form.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/garages', pathMatch: 'full' }, // Redireciona para a lista de garagens
  { path: 'garages', component: GarageListComponent }, // Módulo de garagens
  { path: 'garages/add', component: GarageFormComponent }, // Formulário para adicionar uma nova garagem
  { path: 'garages/edit/:id', component: GarageFormComponent }, // Formulário para editar uma garagem existente
  { path: 'vehicles', component: VehicleListComponent}, // Lista todos os veículos
  { path: 'vehicles/add', component: VehicleFormComponent }, // Formulário para adicionar um novo veículo
  { path: 'vehicles/edit/:id', component: VehicleFormComponent }, // Formulário para editar um veículo existente
  { path: 'garages/:garageId/vehicles', component: VehicleListComponent },
  { path: '**', redirectTo: '/garages' } // Redireciona para a lista de garagens em caso de rota desconhecida
];

