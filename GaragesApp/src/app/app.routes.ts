import { Routes } from '@angular/router';
import { GarageListComponent } from './components/garage-list/garage-list.component';
import { GarageFormComponent } from './components/garage-form/garage-form.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { LoginComponent } from './components/auth/login.component/login.component';
import { RegisterComponent } from './components/auth/register.component/register.component';
import { UserProfileComponent } from './components/user-profile.component/user-profile.component';
import { AdminPageComponent } from './components/pages/admin-page.component/admin-page.component';
import { AuthGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redireciona para a página de login por padrão
  { path: 'admin', loadComponent: () => import('./components/pages/admin-page.component/admin-page.component').then(m => m.AdminPageComponent), canActivate: [AuthGuard], data: { roles: ['admin'] } }, // Página de administração, protegida por AuthGuard
  { path: 'profile', component: UserProfileComponent }, // Protege a rota de perfil com AuthGuard
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'garages', component: GarageListComponent }, // Módulo de garagens
  { path: 'garages/add', component: GarageFormComponent }, // Formulário para adicionar uma nova garagem
  { path: 'garages/edit/:id', component: GarageFormComponent }, // Formulário para editar uma garagem existente
  { path: 'vehicles', component: VehicleListComponent}, // Lista todos os veículos
  { path: 'vehicles/add', component: VehicleFormComponent }, // Formulário para adicionar um novo veículo
  { path: 'vehicles/edit/:id', component: VehicleFormComponent }, // Formulário para editar um veículo existente
  { path: 'garages/:garageId/vehicles', component: VehicleListComponent },
  { path: '**', redirectTo: '/garages' } // Redireciona para a lista de garagens em caso de rota desconhecida
];

