import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { MatchService } from 'src/app/services/match.service';
import { TeamService } from 'src/app/services/team.service';

interface LooseObject {
  [key: string]: any
}

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  matches:any = []
  matches_obj:LooseObject = {}
  teams: LooseObject = {}

  constructor(private match_service: MatchService, private team_service: TeamService) {
    this.retrieveTeams();
    this.retrieveMatches();
  }


  retrieveMatches() {
    this.match_service.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe((data: any) => {
      this.matches = data
      this.matches_obj = {}
      for (let match of data) {
        this.matches_obj[match.id] = match
      }
    })
  }

  retrieveTeams(): void {
    this.team_service.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.teams = {}
      for (let team of data) {
        this.teams[team.id] = team
      }
    });
  }

  ngOnInit(): void {
  }

  public consoleMatchData(id:any) {
    console.log(this.matches_obj[id])
  }
}
