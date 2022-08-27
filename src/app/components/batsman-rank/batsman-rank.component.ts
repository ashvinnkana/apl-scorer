import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { BatsmanService } from 'src/app/services/batsman.service';
import { PlayerService } from 'src/app/services/player.service';

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
  batsman_rank:any = []

  constructor(private batsman_service: BatsmanService, private player_service: PlayerService) {
    this.retrieveBatsman()
    this.retrievePlayers()
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
        try{
          this.batsmans[batsman.player_id].runs.push(batsman.runs)
          this.batsmans[batsman.player_id].total_runs += batsman.runs
        } catch (ex) {
          this.batsmans[batsman.player_id] = {
            runs: [batsman.runs],
            total_runs: batsman.runs
          }
        }
      }
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

  checkRank() {

  }


}
