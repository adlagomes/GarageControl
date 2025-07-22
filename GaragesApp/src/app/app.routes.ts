import { Routes } from '@angular/router';
import { AdminPageComponent } from './components/pages/admin-page.component/admin-page.component';
import { UserProfileComponent } from './components/user-profile.component/user-profile.component';
import { RegisterComponent } from './components/auth/register.component/register.component';
import { LoginComponent } from './components/auth/login.component/login.component';
import { GarageListComponent } from './components/garage-list/garage-list.component';
import { GarageFormComponent } from './components/garage-form/garage-form.component';
import { VehicleListComponent } from './components/vehicle-list/vehicle-list.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';

import { RedirectGuard } from './guards/redirect.guard';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { DummyRedirect } from './components/pages/dummy-redirect/dummy-redirect';

export const routes: Routes = [
  { path: '', component: DummyRedirect, canActivate: [RedirectGuard] },
 // Redireciona para a página de login por padrão
  { path: 'admin', loadComponent: () => import('./components/pages/admin-page.component/admin-page.component').then(m => m.AdminPageComponent), canActivate: [AdminGuard], data: { roles: ['admin'] } }, // Página de administração, protegida por AdminGuard
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] }, // Protege a rota de perfil com AuthGuard
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'garages', component: GarageListComponent }, // Módulo de garagens
  { path: 'garages/add', component: GarageFormComponent, canActivate: [AuthGuard] }, // Formulário para adicionar uma nova garagem
  { path: 'garages/edit/:id', component: GarageFormComponent, canActivate: [AuthGuard] }, // Formulário para editar uma garagem existente
  { path: 'vehicles', component: VehicleListComponent}, // Lista todos os veículos
  { path: 'vehicles/add', component: VehicleFormComponent, canActivate: [AuthGuard] }, // Formulário para adicionar um novo veículo
  { path: 'vehicles/edit/:id', component: VehicleFormComponent, canActivate: [AuthGuard] }, // Formulário para editar um veículo existente
  { path: 'garages/:garageId/vehicles', component: VehicleListComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/garages' } // Redireciona para a lista de garagens em caso de rota desconhecida
];

