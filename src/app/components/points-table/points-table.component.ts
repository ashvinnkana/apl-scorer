import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { PointService } from 'src/app/services/points.service';
import { TeamService } from 'src/app/services/team.service';

interface LooseObject {
  [key: string]: any
}

@Component({
  selector: 'app-points-table',
  templateUrl: './points-table.component.html',
  styleUrls: ['./points-table.component.css']
})
export class PointsTableComponent implements OnInit {

  group_points: LooseObject = {}
  semi_points: LooseObject = {}
  teams: LooseObject = {}
  group_rank: any = []
  semi_rank: any = []

  constructor(private team_service: TeamService, private point_service: PointService) {
    this.retrieve_point_table()
    this.retrieveTeams()
  }

  ngOnInit(): void {
  }

  retrieve_point_table() {
    this.point_service.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe((data: any) => {
      this.group_points = {}
      this.semi_points = {}
      for (let point of data) {
        if (point.type == "group") {
          try {
            this.group_points[point.team_id].played += 1
            this.group_points[point.team_id].points += point.point
          } catch (ex) {
            this.group_points[point.team_id] = {
              played: 1,
              won: 0,
              tied: 0,
              points: point.point
            }
          }
          if (point.point == 2)
            this.group_points[point.team_id].won += 1
          else if (point.point == 1)
            this.group_points[point.team_id].tied += 1
        }
        else {
          try {
            this.semi_points[point.team_id].played += 1
            this.semi_points[point.team_id].points += point.point
          } catch (ex) {
            this.semi_points[point.team_id] = {
              played: 1,
              won: 0,
              tied: 0,
              points: point.point
            }
          }
          if (point.point == 2)
            this.semi_points[point.team_id].won += 1
          else if (point.point == 1)
            this.semi_points[point.team_id].tied += 1
        }

      }

      this.group_rank = []
      for (let team of Object.keys(this.group_points)) {
        this.group_rank.push({
          team_id: team,
          played: this.group_points[team].played,
          won: this.group_points[team].won,
          tied: this.group_points[team].tied,
          points: this.group_points[team].points,
        })
      }

      this.semi_rank = []
      for (let team of Object.keys(this.semi_points)) {
        this.semi_rank.push({
          team_id: team,
          played: this.semi_points[team].played,
          won: this.semi_points[team].won,
          tied: this.semi_points[team].tied,
          points: this.semi_points[team].points,
        })
      }

      this.sortGroup();
      this.sortSemi();
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


  sortGroup() {
    let n = this.group_rank.length;
    for (let i = 1; i < n; i++) {
      // Choosing the first element in our unsorted subarray
      let current = this.group_rank[i];
      // The last element of our sorted subarray
      let j = i - 1;
      while ((j > -1) && (current.points >= this.group_rank[j].points)) {
        this.group_rank[j + 1] = this.group_rank[j];
        j--;
      }
      this.group_rank[j + 1] = current;
    }
  }

  sortSemi() {
    let n = this.semi_rank.length;
    for (let i = 1; i < n; i++) {
      // Choosing the first element in our unsorted subarray
      let current = this.semi_rank[i];
      // The last element of our sorted subarray
      let j = i - 1;
      while ((j > -1) && (current.points >= this.semi_rank[j].points)) {
        this.semi_rank[j + 1] = this.semi_rank[j];
        j--;
      }
      this.semi_rank[j + 1] = current;
    }
  }

}
