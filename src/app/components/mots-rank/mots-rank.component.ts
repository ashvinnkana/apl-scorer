import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { BallerService } from 'src/app/services/baller.service';
import { BatsmanService } from 'src/app/services/batsman.service';
import { PlayerService } from 'src/app/services/player.service';
import { TeamService } from 'src/app/services/team.service';

interface LooseObject {
  [key: string]: any
}

@Component({
  selector: 'app-mots-rank',
  templateUrl: './mots-rank.component.html',
  styleUrls: ['./mots-rank.component.css']
})
export class MotsRankComponent implements OnInit {

  points: LooseObject = {}
  players: LooseObject = {}
  teams: LooseObject = {}
  points_rank: any = []

  constructor(private batsman_service: BatsmanService, private baller_service: BallerService, private player_service: PlayerService, private team_service: TeamService) {
    this.retrievePoints()
    this.retrievePlayers()
    this.retrieveTeams()
  }

  ngOnInit(): void {
  }

  retrievePoints() {
    //batsman
    this.batsman_service.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe((data: any) => {
      this.points = {}
      for (let batsman of data) {
        try {
          this.points[batsman.player_id].bat_history.push(batsman.points)
          this.points[batsman.player_id].total_points += batsman.points
          this.points[batsman.player_id].faced += 1
        } catch (ex) {
          this.points[batsman.player_id] = {
            bat_history: [batsman.points],
            total_points: batsman.points,
            ball_history: [],
            faced: 1
          }
        }
      }

      //bowler
      this.baller_service.getAll().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe((data: any) => {
        for (let bowler of data) {
          try {
            this.points[bowler.player_id].ball_history.push(bowler.points)
            this.points[bowler.player_id].total_points += bowler.points
            this.points[bowler.player_id].faced += 1
          } catch (ex) {
            this.points[bowler.player_id] = {
              ball_history: [bowler.points],
              total_points: bowler.points,
              bat_history: [],
              faced: 1
            }
          }
        }

        this.points_rank = []
        for (let player of Object.keys(this.points)) {
          if (this.points[player].ball_history.length == 0 || this.points[player].bat_history.length == 0)
            continue

          this.points[player].hid_points = this.points[player].total_points
          this.points[player].add_points = (20 * this.points[player].faced)
          this.points[player].hid_points += this.points[player].add_points
          this.points_rank.push({
            player_id: player,
            ball_history: this.points[player].ball_history,
            total_points: this.points[player].total_points,
            bat_history: this.points[player].bat_history,
            faced: this.points[player].faced,
            hid_points: this.points[player].hid_points,
            add_points: this.points[player].add_points
          })
        }

        this.sortByPoints();
      })


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

  sortByPoints() {
    let n = this.points_rank.length;
    for (let i = 1; i < n; i++) {
      // Choosing the first element in our unsorted subarray
      let current = this.points_rank[i];
      // The last element of our sorted subarray
      let j = i - 1;
      while ((j > -1) && (current.hid_points >= this.points_rank[j].hid_points)) {
        this.points_rank[j + 1] = this.points_rank[j];
        j--;
      }
      this.points_rank[j + 1] = current;
    }
  }
}
