import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { PlayerService } from 'src/app/services/player.service';
import { TeamService } from './../../services/team.service';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.css']
})
export class TeamManagementComponent implements OnInit {

  name: any
  company: any
  team: any = "select"
  teams?: any = [];

  constructor(private team_service: TeamService, private player_service: PlayerService) {
    this.retrieveTeams();
  }

  ngOnInit(): void {
  }

  retrieveTeams(): void {
    this.team_service.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.teams = data;
    });
  }

  add_to_team() {
    var data = {
      name: this.name,
      team: this.team,
      company: this.company
    }
    /*var datas = [
      {name:"Kajan", team:"s2CyX8aApwI9zHRlFqdz", company:"SHANIKA"},
    ]*/

    //for (let data of datas){  
      this.player_service.create(data).then(() => {
        console.log('New player added!');
      });
    //}
    
  }

}
