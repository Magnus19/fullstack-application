import { Routes } from '@angular/router';
import { Home } from './home/home';
import { LeaderForm } from './leader-form/leader-form';
import { LeaderList } from './leader-list/leader-list';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    title: 'Home | Gym Leader Registry',
  },
  { path: 'home', component: Home, title: 'Home | Gym Leader Registry' },
  { path: 'leaders', component: LeaderList, title: 'Gym Leaders | Registry' },
  { path: 'leaders/new', component: LeaderForm, title: 'Register a Gym Leader' },
  { path: 'leaders/:id/edit', component: LeaderForm, title: 'Edit Gym Leader' },
  { path: '**', component: NotFound, title: 'Page Not Found' },
];
