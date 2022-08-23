import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import { ScorerDashboardComponent } from './components/scorer-dashboard/scorer-dashboard.component';
import { TeamManagementComponent } from './components/team-management/team-management.component';

const routes: Routes = [
  { path: '', redirectTo: 'scorer-dashboard', pathMatch: 'full' },
  { path: 'tutorials', component: TutorialsListComponent },
  { path: 'add', component: AddTutorialComponent },
  { path: 'scorer-dashboard', component: ScorerDashboardComponent },
  { path: 'teams', component: TeamManagementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
