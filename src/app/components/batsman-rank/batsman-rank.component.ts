import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { BatsmanService } from 'src/app/services/batsman.service';
import { PlayerService } from 'src/app/services/player.service';
import { TeamService } from 'src/app/services/team.service';

interface LooseObject {
  [key: string]: any
}

@Component({
  selector: 'app-batsman-rank',
  templateUrl: './batsman-rank.component.html',
  styleUrls: ['./batsman-rank.component.css']
})
export class BatsmanRankComponent implements OnInit {

  batsmans: LooseObject = {}
  players: LooseObject = {}
  teams: LooseObject = {}
  batsman_rank: any = []

  constructor(private batsman_service: BatsmanService, private player_service: PlayerService, private team_service: TeamService) {
    this.retrieveBatsman()
    this.retrievePlayers()
    this.retrieveTeams()
  }

  ngOnInit(): void {
  }

  retrieveBatsman() {
    this.batsman_service.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe((data: any) => {
      this.batsmans = {}
      for (let batsman of data) {
        try {
          this.batsmans[batsman.player_id].runs.push(batsman.runs)
          this.batsmans[batsman.player_id].total_runs += batsman.runs
        } catch (ex) {
          this.batsmans[batsman.player_id] = {
            runs: [batsman.runs],
            total_runs: batsman.runs
          }
        }
      }

      this.batsman_rank = []
      for (let batsman of Object.keys(this.batsmans)) {
        this.batsman_rank.push({
          batsman_id: batsman,
          total_runs: this.batsmans[batsman].total_runs,
          runs: this.batsmans[batsman].runs
        })
      }

      this.sortByRuns();
      console.log(this.batsman_rank)
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

  sortByRuns() {
    let n = this.batsman_rank.length;
    for (let i = 1; i < n; i++) {
      // Choosing the first element in our unsorted subarray
      let current = this.batsman_rank[i];
      // The last element of our sorted subarray
      let j = i - 1;
      while ((j > -1) && (current.total_runs >= this.batsman_rank[j].total_runs)) {
        this.batsman_rank[j + 1] = this.batsman_rank[j];
        j--;
      }
      this.batsman_rank[j + 1] = current;
    }
  }


}
