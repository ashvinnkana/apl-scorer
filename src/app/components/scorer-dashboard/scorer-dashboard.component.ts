import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Team } from 'src/app/models/team.model';
import { TeamService } from './../../services/team.service';
import { LiveMatchService } from './../../services/live-match.service';
import { PlayerService } from 'src/app/services/player.service';

interface LooseObject {
  [key: string]: any
}

@Component({
  selector: 'app-scorer-dashboard',
  templateUrl: './scorer-dashboard.component.html',
  styleUrls: ['./scorer-dashboard.component.css']
})
export class ScorerDashboardComponent implements OnInit {

  teams?: any = [];
  players?: any = [];
  teams_obj: LooseObject = {};
  players_team_obj: LooseObject = {};
  players_obj: LooseObject = {};
  live_match: any = {
    team_1: "select",
    team_2: "select",
    overs: 5,
    balls: 5,
    inning: 1,
    inning_detail: {}
  }
  back_up_live: any
  isLive = false;
  special_ball: any
  wicket_ball: any
  runout_batsman: any = "select"
  bye_ball: any
  runs_ball: any

  constructor(private team_service: TeamService, private live_service: LiveMatchService,
    private player_service: PlayerService) {
    this.retrieveTeams();
    this.retrievePlayers();
    this.retrieveLiveMatch();

  }

  ngOnInit(): void {

  }

  retrieveLiveMatch(): void {
    this.live_service.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      if (data.length != 0) {
        this.live_match = data[0];
        this.back_up_live = JSON.parse(JSON.stringify(this.live_match))
        this.isLive = true
      } else {
        this.live_match = {
          team_1: "select",
          team_2: "select",
          overs: 5,
          balls: 5,
          inning: 1,
          inning_detail: {}
        }
        this.isLive = false
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
      this.teams = data;
      for (let team of this.teams) {
        this.teams_obj[team.id] = team
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
      this.players = data;
      for (let player of this.players) {
        this.players_obj[player.id] = player
        try {
          this.players_team_obj[player.team].push(player)
        } catch (ex) {
          this.players_team_obj[player.team] = [player]
        }
      }
    });
  }

  public start_match() {

    if (this.live_match.team_1 == "select" || this.live_match.team_2 == "select" ||
      this.live_match.overs == null || this.live_match.balls == null) {
      alert("ALERT => All fields Required!")
      return
    }

    if (this.live_match.overs < 1 || this.live_match.balls < 1) {
      alert("ALERT => Overs or Balls cannot be less than 1!")
      return
    }

    this.live_match.inning_detail = {
      1: {
        redo_possible: false,
        cur_version: 0,
        versions: [{
          score: 0,
          extras: 0,
          wicket: 0,
          over: 0,
          ball: 0,
          current_bat: 0,
          next_bat: 1,
          batting: this.live_match.team_1,
          bat_detail: [
            { id: "select", runs: 0, status: "NOT OUT", onStrike: "*" },
            { id: "select", runs: 0, status: "NOT OUT", onStrike: "" },
          ],
          fielding: this.live_match.team_2,
          ball_detail: [
            { id: "select", wickets: 0, runs_given: 0, total_runs: 0, bye_runs: 0, current: "*", over: [] }
          ]
        }]
      },
      2: {}
    }
    /*
    for (let i = 1; i < this.live_match.overs; i++) {
      this.live_match.inning_detail["1"]["ball_detail"].push({ id: "select", wickets: 0, runs_given: 0, current:"", over: [] })
    }*/

    this.live_service.create(this.live_match).then((data: any) => {
      console.log('Started new live match!');
      this.isLive = true
    });
  }

  public update_current_version(option: any) {
    switch (option) {
      case "undo":
        if (this.live_match.inning_detail[this.live_match.inning]?.cur_version != 0) {
          this.live_match.inning_detail[this.live_match.inning].cur_version -= 1
          this.live_match.inning_detail[this.live_match.inning].redo_possible = true
        } else {
          return
        }
        break
      case "redo":
        if (this.live_match.inning_detail[this.live_match.inning].redo_possible) {
          this.live_match.inning_detail[this.live_match.inning].cur_version += 1
          if (this.live_match.inning_detail[this.live_match.inning].cur_version == this.live_match.inning_detail[this.live_match.inning].versions.length - 1) {
            this.live_match.inning_detail[this.live_match.inning].redo_possible = false
          }
        } else {
          return
        }
        break
    }
    this.live_service.update(this.live_match.id, this.live_match)
      .then(() => { })
      .catch(err => console.log(err));
  }

  public update_live_match() {

    this.back_up_live.inning_detail[this.back_up_live.inning].redo_possible = false
    while (this.back_up_live.inning_detail[this.live_match.inning].cur_version != this.back_up_live.inning_detail[this.live_match.inning].versions.length - 1) {
      this.back_up_live.inning_detail[this.back_up_live.inning].versions.pop()
    }
    this.back_up_live.inning_detail[this.back_up_live.inning].cur_version += 1
    this.back_up_live.inning_detail[this.back_up_live.inning].versions.push(
      this.get_current_version(this.live_match.inning))

    this.live_service.update(this.live_match.id, this.back_up_live)
      .then(() => console.log('updated successfully!'))
      .catch(err => console.log(err));
  }

  public clear_control_panel() {
    this.special_ball = undefined
    this.bye_ball = undefined
    this.wicket_ball = undefined
    this.runs_ball = undefined
    this.runout_batsman = "select"
  }

  public record_over_ball() {
    this.update_ballblock()
    this.update_runs()
    this.handle_specialball()
    this.handle_wicket()
    this.update_ball()
    this.update_over()
    this.check_innings()

    this.clear_control_panel()
    this.update_live_match()

  }

  public handle_wicket() {
    if (this.wicket_ball != undefined) {
      var out_bat;
      var out_location;
      this.get_current_version(this.live_match.inning).wicket += 1
      
      if (this.wicket_ball == "W") {
        this.get_current_version(this.live_match.inning).ball_detail[this.get_current_version(this.live_match.inning).over].wickets += 1
        out_bat = this.live_match.inning_detail[this.live_match.inning]?.versions[this.live_match.inning_detail[this.live_match.inning]?.cur_version]?.current_bat
      } else {
        out_bat = this.runout_batsman
      }
      
      if (this.get_current_version(this.live_match.inning).bat_detail[out_bat].onStrike == "*") {
        out_location = "current_bat"
        this.get_current_version(this.live_match.inning).bat_detail.push({ id: "select", runs: 0, status: "NOT OUT", onStrike: "*" })
      } else {
        out_location = "next_bat"
        this.get_current_version(this.live_match.inning).bat_detail.push({ id: "select", runs: 0, status: "NOT OUT", onStrike: "" })
      }
      this.get_current_version(this.live_match.inning).bat_detail[out_bat].onStrike = ""
      this.get_current_version(this.live_match.inning).bat_detail[out_bat].status = "OUT"
      this.get_current_version(this.live_match.inning)[out_location] = this.get_current_version(this.live_match.inning).bat_detail.length - 1

    }
  }

  public get_current_version(inning: any) {
    return this.live_match.inning_detail[inning].versions[this.live_match.inning_detail[inning].cur_version]
  }

  public handle_specialball() {
    if (this.special_ball != undefined) {
      this.get_current_version(this.live_match.inning).extras += 2
      this.get_current_version(this.live_match.inning).ball_detail[this.get_current_version(this.live_match.inning).over].runs_given += 2
      this.get_current_version(this.live_match.inning).score += 2
      this.get_current_version(this.live_match.inning).ball_detail[this.get_current_version(this.live_match.inning).over].total_runs += 2
    }
  }

  public check_innings() {

  }

  public update_over() {
    if (this.special_ball == undefined) {
      if (this.get_current_version(this.live_match.inning).ball == 0) {
        this.get_current_version(this.live_match.inning).over += 1
        if (this.get_current_version(this.live_match.inning).over < this.live_match.overs) {
          this.get_current_version(this.live_match.inning).ball_detail.push({ id: "select", wickets: 0, runs_given: 0, total_runs: 0, bye_runs: 0, current: "*", over: [] })
          this.get_current_version(this.live_match.inning).ball_detail[this.get_current_version(this.live_match.inning).over - 1].current = ""
        }
      }
    }
  }

  public update_ball() {
    if (this.special_ball == undefined) {
      this.get_current_version(this.live_match.inning).ball += 1
      if (this.get_current_version(this.live_match.inning).ball >= this.live_match.balls) {
        this.get_current_version(this.live_match.inning).ball = 0
      }
    }
  }

  public update_ballblock() {
    var ball_block = this.generate_ballblock()
    this.get_current_version(this.live_match.inning).ball_detail[this.get_current_version(this.live_match.inning).over].over.push(ball_block)
  }

  public generate_ballblock() {
    var ball_block = {
      text: "",
      runs: this.runs_ball,
      type: "",
      text_color: "grey"
    }

    if (this.special_ball != undefined) {
      if (ball_block.text != "")
        ball_block.text += " & "
      ball_block.text += this.special_ball
      ball_block.text_color = "#e32636";
      if (this.wicket_ball != undefined) {
        ball_block.type = "wicket-special"
        if (ball_block.text != "")
          ball_block.text += " & "
        ball_block.text += this.wicket_ball
      } else {
        ball_block.type = "special"
      }
    } else if (this.wicket_ball != undefined) {
      if (ball_block.text != "")
        ball_block.text += " & "
      ball_block.text += this.wicket_ball
      ball_block.type = "wicket"
    } else {
      ball_block.type = "normal"
    }
    if (this.bye_ball != undefined) {
      if (ball_block.text != "")
        ball_block.text += " & "
      ball_block.text += this.bye_ball
    }

    return ball_block;
  }

  public update_runs() {
    if (this.bye_ball != undefined) {
      this.get_current_version(this.live_match.inning).extras += Number(this.runs_ball)
      this.get_current_version(this.live_match.inning).ball_detail[this.get_current_version(this.live_match.inning).over].bye_runs += Number(this.runs_ball)
    } else {
      this.get_current_version(this.live_match.inning).bat_detail[this.get_current_version(this.live_match.inning).current_bat].runs += Number(this.runs_ball)
      this.get_current_version(this.live_match.inning).ball_detail[this.get_current_version(this.live_match.inning).over].runs_given += Number(this.runs_ball)
    }
    this.get_current_version(this.live_match.inning).score += Number(this.runs_ball)
    this.get_current_version(this.live_match.inning).ball_detail[this.get_current_version(this.live_match.inning).over].total_runs += Number(this.runs_ball)

    if (Number(this.runs_ball) % 2 != 0) {
      this.switch_batsman();
    }
  }

  public switch_batsman() {
    var temp = this.get_current_version(this.live_match.inning).current_bat
    this.get_current_version(this.live_match.inning).current_bat = this.get_current_version(this.live_match.inning).next_bat
    this.get_current_version(this.live_match.inning).next_bat = temp

    this.get_current_version(this.live_match.inning).bat_detail[this.get_current_version(this.live_match.inning).current_bat].onStrike = "*"
    this.get_current_version(this.live_match.inning).bat_detail[this.get_current_version(this.live_match.inning).next_bat].onStrike = ""
  }

  public update_batsman() {
    this.switch_batsman()
    this.update_live_match()
  }
}
