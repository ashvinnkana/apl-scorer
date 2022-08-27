import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { BallerService } from 'src/app/services/baller.service';
import { PlayerService } from 'src/app/services/player.service';
import { TeamService } from 'src/app/services/team.service';

interface LooseObject {
  [key: string]: any
}


@Component({
  selector: 'app-bowler-rank',
  templateUrl: './bowler-rank.component.html',
  styleUrls: ['./bowler-rank.component.css']
})
export class BowlerRankComponent implements OnInit {

  bowlers: LooseObject = {}
  players: LooseObject = {}
  teams: LooseObject = {}
  bowler_rank: any = []

  constructor(private baller_service: BallerService, private player_service: PlayerService, private team_service: TeamService) { 
    this.retrieveBatsman()
    this.retrievePlayers()
    this.retrieveTeams()}

  ngOnInit(): void {
  }

  
  retrieveBatsman() {
    this.baller_service.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe((data: any) => {
      this.bowlers = {}
      for (let bowler of data) {
        try {
          this.bowlers[bowler.player_id].wickets.push(bowler.wickets)
          this.bowlers[bowler.player_id].total_wickets += bowler.wickets
        } catch (ex) {
          this.bowlers[bowler.player_id] = {
            wickets: [bowler.wickets],
            total_wickets: bowler.wickets
          }
        }
      }
      console.log(this.bowlers)
      this.bowler_rank = []
      for (let bowler of Object.keys(this.bowlers)) {
        this.bowler_rank.push({
          bowler_id: bowler,
          total_wickets: this.bowlers[bowler].total_wickets,
          wickets: this.bowlers[bowler].wickets
        })
      }

      this.sortByWickets();
      console.log(this.bowler_rank)
    });
  }

  retrievePlayers(): void {
    this.player_service.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.players = {}
      for (let player of data) {
        this.players[player.id] = player
      }
    });
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

  sortByWickets() {
    let n = this.bowler_rank.length;
    for (let i = 1; i < n; i++) {
      // Choosing the first element in our unsorted subarray
      let current = this.bowler_rank[i];
      // The last element of our sorted subarray
      let j = i - 1;
      while ((j > -1) && (current.total_wickets >= this.bowler_rank[j].total_wickets)) {
        this.bowler_rank[j + 1] = this.bowler_rank[j];
        j--;
      }
      this.bowler_rank[j + 1] = current;
    }
  }

}
