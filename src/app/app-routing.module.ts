import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScorerDashboardComponent } from './components/scorer-dashboard/scorer-dashboard.component';
import { TeamManagementComponent } from './components/team-management/team-management.component';

const routes: Routes = [
  { path: '', redirectTo: 'live-match', pathMatch: 'full' },
  { path: 'live-match', component: ScorerDashboardComponent },
  { path: 'players', component: TeamManagementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
