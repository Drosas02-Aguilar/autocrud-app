import { Routes } from '@angular/router';
import { AgenciaForm } from './components/agencia/agencias-form/agencia-form.component';
import { Component } from '@angular/core';
import { AgenciaList } from './components/agencia/agencias-list/agencia-list.component';
import { AutoForm } from './components/autos/auto-form/auto-form.component';
import { AutoList } from './components/autos/auto-list/auto-list.component';

export const routes: Routes = [
  { path: '',           redirectTo: 'agencias', pathMatch: 'full' }, 
  { path: 'agencias',  component: AgenciaList },
  { path: 'agencias/nueva',          component: AgenciaForm },
  { path: 'agencias/editar/:id',     component: AgenciaForm },
  { path: 'autos',     component: AutoList },
  { path: 'autos/nuevo',             component: AutoForm },
  { path: 'autos/editar/:id',        component: AutoForm },
  { path: '**',         redirectTo: 'agencias' },                  
];
