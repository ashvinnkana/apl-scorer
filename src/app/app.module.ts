import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScorerDashboardComponent } from './components/scorer-dashboard/scorer-dashboard.component';
import { TeamManagementComponent } from './components/team-management/team-management.component';
import { BatsmanRankComponent } from './components/batsman-rank/batsman-rank.component';
import { BowlerRankComponent } from './components/bowler-rank/bowler-rank.component';
import { MotsRankComponent } from './components/mots-rank/mots-rank.component';
import { PointsTableComponent } from './components/points-table/points-table.component';
import { MatchesComponent } from './components/matches/matches.component';

@NgModule({
  declarations: [
    AppComponent,
    ScorerDashboardComponent,
    TeamManagementComponent,
    BatsmanRankComponent,
    BowlerRankComponent,
    MotsRankComponent,
    PointsTableComponent,
    MatchesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // for firestore
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
