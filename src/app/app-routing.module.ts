import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScorerDashboardComponent } from './components/scorer-dashboard/scorer-dashboard.component';
import { TeamManagementComponent } from './components/team-management/team-management.component';
import { BatsmanRankComponent } from './components/batsman-rank/batsman-rank.component';
import { BowlerRankComponent } from './components/bowler-rank/bowler-rank.component';

const routes: Routes = [
  { path: '', redirectTo: 'live-match', pathMatch: 'full' },
  { path: 'live-match', component: ScorerDashboardComponent },
  { path: 'players', component: TeamManagementComponent },
  { path: 'best-batsman', component: BatsmanRankComponent },
  { path: 'best-bowler', component: BowlerRankComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
