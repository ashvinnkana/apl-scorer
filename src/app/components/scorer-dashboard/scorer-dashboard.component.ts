import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Team } from 'src/app/models/team.model';
import { TeamService } from './../../services/team.service';
import { LiveMatchService } from './../../services/live-match.service';
import { PlayerService } from 'src/app/services/player.service';
import { MatchService } from 'src/app/services/match.service';
import { BatsmanService } from 'src/app/services/batsman.service';
import { BallerService } from 'src/app/services/baller.service';
import { Baller } from 'src/app/models/baller.model';
import { PointService } from 'src/app/services/points.service';

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
    wickets: 7,
    point_1: 0,
    point_2: 0,
    balls: 5,
    inning: 1,
    type: "group",
    inning_detail: {}
  }
  back_up_live: any
  isLive = false;
  special_ball: any
  wicket_ball: any
  runout_batsman: any = "select"
  bye_ball: any
  runs_ball: any
  wonby: any

  constructor(private team_service: TeamService, private live_service: LiveMatchService,
    private player_service: PlayerService, private match_service: MatchService,
    private batsman_service: BatsmanService, private baller_service: BallerService,
    private point_service: PointService) {
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
          wickets: 7,
          point_1: 0,
          point_2: 0,
          balls: 5,
          inning: 1,
          type: "group",
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
      this.teams_obj = {}
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
      this.players_obj = {}
      this.players_team_obj = {}
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
      this.live_match.overs == null || this.live_match.balls == null || this.live_match.wickets == null) {
      alert("ALERT => All fields Required!")
      return
    }

    if (this.live_match.overs < 1 || this.live_match.balls < 1 || this.live_match.wickets < 1) {
      alert("ALERT => Overs or Balls cannot be less than 1!")
      return
    }

    this.live_match.inning_detail = {
      1: {
        redo_possible: false,
        cur_version: 0,
        versions: [{
          done: false,
          score: 0,
          extras: 0,
          wicket: 0,
          over: 0,
          ball: 0,
          current_bat: 0,
          next_bat: 1,
          batting: this.live_match.team_1,
          bat_detail: [
            { id: "select", runs: 0, status: "NOT OUT", onStrike: "*", points: 0 },
            { id: "select", runs: 0, status: "NOT OUT", onStrike: "", points: 0 },
          ],
          fielding: this.live_match.team_2,
          ball_detail: [
            { id: "select", wickets: 0, runs_given: 0, total_runs: 0, bye_runs: 0, current: "*", over: [], points: 0 }
          ]
        }]
      },
      2: {
        redo_possible: false,
        cur_version: 0,
        versions: [{
          target: 0,
          done: false,
          score: 0,
          extras: 0,
          wicket: 0,
          over: 0,
          ball: 0,
          current_bat: 0,
          next_bat: 1,
          batting: this.live_match.team_2,
          bat_detail: [
            { id: "select", runs: 0, status: "NOT OUT", onStrike: "*", points: 0 },
            { id: "select", runs: 0, status: "NOT OUT", onStrike: "", points: 0 },
          ],
          fielding: this.live_match.team_1,
          ball_detail: [
            { id: "select", wickets: 0, runs_given: 0, total_runs: 0, bye_runs: 0, current: "*", over: [], points: 0 }
          ]
        }]
      }
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

  public update_live_match_inning() {

    this.back_up_live.inning_detail[this.back_up_live.inning].redo_possible = false
    while (this.back_up_live.inning_detail[this.live_match.inning].cur_version != this.back_up_live.inning_detail[this.live_match.inning].versions.length - 1) {
      this.back_up_live.inning_detail[this.back_up_live.inning].versions.pop()
    }
    this.back_up_live.inning_detail[this.back_up_live.inning].cur_version += 1
    this.back_up_live.inning_detail[this.back_up_live.inning].versions.push(
      this.get_current_version(this.live_match.inning))

    this.live_service.update(this.live_match.id, this.back_up_live)
      .then(() => { })
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
    this.update_points()
    this.update_runs()
    this.handle_specialball()
    this.handle_wicket()
    this.update_ball()
    this.update_over()
    this.check_innings()

    this.clear_control_panel()
    this.update_live_match_inning()

  }

  public update_points() {
    //byes
    if (this.bye_ball != undefined) {
      this.get_current_batsman().points -= 1
      this.get_current_bowler().points += 1
    }
    if (this.special_ball == "WD" && this.bye_ball == undefined && this.runs_ball != "0") {
      this.get_current_batsman().points -= 1
      this.get_current_bowler().points += 1
    }

    //WD or NB
    if (this.special_ball == "WD" || this.special_ball == "NB") {
      this.get_current_batsman().points += 0
      this.get_current_bowler().points -= 2
    }

    //wicket, catch, stumping
    if (this.wicket_ball == "W") {
      this.get_current_batsman().points -= 4
      this.get_current_bowler().points += 6
    }

    //Runout
    if (this.wicket_ball == "RO") {
      //fix issue
      this.get_current_version(this.live_match.inning).bat_detail[this.runout_batsman].points -= 2
      if (this.runs_ball == '0')
        this.get_current_bowler().points += 2
      else if (this.runs_ball == '1')
        this.get_current_bowler().points += 1
      else
        this.get_current_bowler().points += 0
    }

    // 1 run
    if (this.bye_ball == undefined && this.special_ball != "WD" && this.runs_ball == "1") {
      this.get_current_batsman().points += 1
      this.get_current_bowler().points += 1
    }

    // 2 runs
    if (this.bye_ball == undefined && this.special_ball != "WD" && this.runs_ball == "2") {
      this.get_current_batsman().points += 1
      this.get_current_bowler().points += 0
    }

    // 3 runs
    if (this.bye_ball == undefined && this.special_ball != "WD" && this.runs_ball == "3") {
      this.get_current_batsman().points += 2
      this.get_current_bowler().points -= 1
    }

    // 4 runs
    if (this.bye_ball == undefined && this.special_ball != "WD" && this.runs_ball == "4") {
      this.get_current_batsman().points += 3
      this.get_current_bowler().points -= 2
    }

    // 6 runs
    if (this.bye_ball == undefined && this.special_ball != "WD" && this.runs_ball == "6") {
      this.get_current_batsman().points += 5
      this.get_current_bowler().points -= 3
    }

    // dot ball
    if (this.bye_ball == undefined && this.special_ball == undefined && this.wicket_ball == undefined
      && this.runs_ball == "0") {
      this.get_current_batsman().points -= 1
      this.get_current_bowler().points += 2
    }
  }

  public get_current_batsman() {
    return this.get_current_version(this.live_match.inning).bat_detail[this.get_current_version(this.live_match.inning).current_bat]
  }

  public get_current_bowler() {
    return this.get_current_version(this.live_match.inning).ball_detail[this.get_current_version(this.live_match.inning).over]
  }

  public handle_wicket() {
    if (this.wicket_ball != undefined) {
      var out_bat;
      var out_location;
      this.get_current_version(this.live_match.inning).wicket += 1

      if (this.wicket_ball == "W") {
        this.get_current_bowler().wickets += 1
        out_bat = this.get_current_version(this.live_match.inning)?.current_bat
      } else {
        out_bat = this.runout_batsman
      }

      if (this.get_current_version(this.live_match.inning).bat_detail[out_bat].onStrike == "*") {
        out_location = "current_bat"
        this.get_current_version(this.live_match.inning).bat_detail.push({ id: "select", runs: 0, status: "NOT OUT", onStrike: "*", points: 0 })
      } else {
        out_location = "next_bat"
        this.get_current_version(this.live_match.inning).bat_detail.push({ id: "select", runs: 0, status: "NOT OUT", onStrike: "", points: 0 })
      }
      this.get_current_version(this.live_match.inning).bat_detail[out_bat].onStrike = ""
      this.get_current_version(this.live_match.inning).bat_detail[out_bat].status = "OUT"
      this.get_current_version(this.live_match.inning)[out_location] = this.get_current_version(this.live_match.inning).bat_detail.length - 1

    }
  }

  public get_current_version(inning: any) {
    return this.live_match?.inning_detail[inning]?.versions[this.live_match?.inning_detail[inning]?.cur_version]
  }

  public handle_specialball() {
    if (this.special_ball != undefined) {
      this.get_current_version(this.live_match.inning).extras += 2
      this.get_current_bowler().runs_given += 2
      this.get_current_version(this.live_match.inning).score += 2
      this.get_current_bowler().total_runs += 2
    }
  }

  public check_innings() {

    if (this.get_current_version(this.live_match.inning)?.score >= this.get_current_version(this.live_match.inning)?.target) {
      this.get_current_version(this.live_match.inning).done = true
      this.wonby = this.get_current_version(this.live_match.inning).batting
      alert("End of Match! Match won by " + this.teams_obj[this.get_current_version(this.live_match.inning).batting]?.name)
    }

    if (this.get_current_version(this.live_match.inning).wicket == this.live_match.wickets ||
      this.get_current_version(this.live_match.inning).over == this.live_match.overs) {
      if (this.live_match.inning == 1) {
        var target = this.get_current_version(this.live_match.inning).score + 1
        this.get_current_version(this.live_match.inning).done = true
        alert("End of 1st Inning, Target : " + target)
      } else if (this.get_current_version(this.live_match.inning)?.score < this.get_current_version('1')?.score) {
        this.get_current_version(this.live_match.inning).done = true
        this.wonby = this.get_current_version(this.live_match.inning).fielding
        alert("End of Match! Match won by " + this.teams_obj[this.get_current_version(this.live_match.inning).fielding]?.name)
      } else if (this.get_current_version(this.live_match.inning)?.score == this.get_current_version('1')?.score) {
        this.get_current_version(this.live_match.inning).done = true
        this.wonby = "tie"
        alert("End of Match! DRAW!")
      }
    }
  }

  public update_over() {
    if (this.special_ball == undefined) {
      if (this.get_current_version(this.live_match.inning).ball == 0) {
        this.get_current_version(this.live_match.inning).over += 1
        this.switch_batsman()
        if (this.get_current_version(this.live_match.inning).over < this.live_match.overs) {
          this.get_current_version(this.live_match.inning).ball_detail.push({ id: "select", wickets: 0, runs_given: 0, total_runs: 0, bye_runs: 0, current: "*", over: [], points: 0 })
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
    this.get_current_bowler().over.push(ball_block)
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
    if (this.bye_ball != undefined || this.special_ball == "WD") {
      this.get_current_version(this.live_match.inning).extras += Number(this.runs_ball)
      this.get_current_bowler().bye_runs += Number(this.runs_ball)

    } else {
      this.get_current_batsman().runs += Number(this.runs_ball)
      this.get_current_bowler().runs_given += Number(this.runs_ball)
    }
    this.get_current_version(this.live_match.inning).score += Number(this.runs_ball)
    this.get_current_bowler().total_runs += Number(this.runs_ball)

    if (Number(this.runs_ball) % 2 != 0) {
      this.switch_batsman();
    }
  }

  public switch_batsman() {
    var temp = this.get_current_version(this.live_match.inning).current_bat
    this.get_current_version(this.live_match.inning).current_bat = this.get_current_version(this.live_match.inning).next_bat
    this.get_current_version(this.live_match.inning).next_bat = temp

    this.get_current_batsman().onStrike = "*"
    this.get_current_version(this.live_match.inning).bat_detail[this.get_current_version(this.live_match.inning).next_bat].onStrike = ""
  }

  public update_batsman() {
    this.switch_batsman()
    this.update_live_match_inning()
  }

  public next_inning() {
    this.live_match.inning_detail["2"] = {
      redo_possible: false,
      cur_version: 0,
      versions: [{
        target: (this.get_current_version(this.live_match.inning).score + 1),
        done: false,
        score: 0,
        extras: 0,
        wicket: 0,
        over: 0,
        ball: 0,
        current_bat: 0,
        next_bat: 1,
        batting: this.live_match.team_2,
        bat_detail: [
          { id: "select", runs: 0, status: "NOT OUT", onStrike: "*", points: 0 },
          { id: "select", runs: 0, status: "NOT OUT", onStrike: "", points: 0 },
        ],
        fielding: this.live_match.team_1,
        ball_detail: [
          { id: "select", wickets: 0, runs_given: 0, total_runs: 0, bye_runs: 0, current: "*", over: [], points: 0 }
        ]
      }]
    }
    this.live_match.inning = 2

    this.live_service.update(this.live_match.id, this.live_match)
      .then(() => { })
      .catch(err => console.log(err));
  }

  public end_match() {
    var match_data: any = JSON.parse(JSON.stringify(this.live_match))
    match_data.inning_detail = {
      1: this.get_current_version('1'),
      2: this.get_current_version('2')
    }

    if (this.get_current_version(this.live_match.inning)?.score >= this.get_current_version(this.live_match.inning)?.target) {
      this.wonby = this.get_current_version(this.live_match.inning).batting
    }
    if (this.get_current_version(this.live_match.inning).wicket == this.live_match.wickets ||
      this.get_current_version(this.live_match.inning).over == this.live_match.overs) {
      if (this.get_current_version(this.live_match.inning)?.score < this.get_current_version('1')?.score) {
        this.wonby = this.get_current_version(this.live_match.inning).fielding
      } else if (this.get_current_version(this.live_match.inning)?.score == this.get_current_version('1')?.score) {
        this.wonby = "tie"
      }
    }

    if (match_data.team_1 == this.wonby)
      match_data.point_1 = 2
    else if (match_data.team_2 == this.wonby)
      match_data.point_2 = 2
    else {
      match_data.point_1 = 1
      match_data.point_2 = 1
    }

    delete match_data['id']

    //save match data
    this.match_service.create(match_data).then((data1: any) => {
      console.log('Match Data Saved!');
      //update points table
      if (match_data.type == 'group' || match_data.type == 'semifinal') {
        var point_data = {
          team_id: match_data.team_1,
          match_id: data1.id,
          type: match_data.type,
          point: match_data.point_1
        }
        this.point_service.create(point_data).then((data: any) => {
          console.log('Updated points table of Team 1!');
        });
        point_data = {
          team_id: match_data.team_2,
          match_id: data1.id,
          type: match_data.type,
          point: match_data.point_2
        }
        this.point_service.create(point_data).then((data: any) => {
          console.log('Updated points table of Team 2!');
        });
      }

      //save player points
      if (match_data.type != 'unrated') {
        for (let inning = 1; inning <= 2; inning++) {
          //batsman
          var batsman_record = {
            player_id: '',
            match_id: '',
            runs: 0,
            points: 0
          }
          for (let batsman of match_data.inning_detail[inning.toString()].bat_detail) {
            if (batsman.id == 'select')
              continue
            batsman_record = {
              player_id: batsman.id,
              match_id: data1.id,
              runs: 0,
              points: batsman.points
            }
            if (match_data.type == 'group') {
              batsman_record.runs = batsman.runs
            }

            this.batsman_service.create(batsman_record).then((data: any) => {
              console.log('Batsman ' + this.players_obj[batsman.id].name + ' Record Saved!');
            })
          }

          //bowler
          var bowler_record = {
            player_id: '',
            match_id: '',
            wickets: 0,
            points: 0
          }
          for (let bowler of match_data.inning_detail[inning.toString()].ball_detail) {
            if (bowler.id == 'select')
              continue
            bowler_record = {
              player_id: bowler.id,
              match_id: data1.id,
              wickets: 0,
              points: bowler.points
            }
            if (match_data.type == 'group') {
              bowler_record.wickets = bowler.wickets
            }

            this.baller_service.create(bowler_record).then((data: any) => {
              console.log('Bowler ' + this.players_obj[bowler.id].name + ' Record Saved!');
            })
          }
        }
      }
    });

    //close live
    this.live_service.delete(this.live_match.id)
    .then(() => {
      console.log('Live Match Ended');
      this.isLive = false
    })
    .catch(err => console.log(err));
  }
}
