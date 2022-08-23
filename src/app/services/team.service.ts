import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private dbPath = '/apl-teams';
  private teamRef:AngularFirestoreCollection<Team>;

  constructor(private db: AngularFirestore) {
    this.teamRef = db.collection(this.dbPath)
  }

  getAll(): AngularFirestoreCollection<Team> {
    return this.teamRef;
  }
  
  create(team: any): any {
    return this.teamRef.add({ ...team });
  }

  update(id: string, data: any): Promise<void> {
    return this.teamRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.teamRef.doc(id).delete();
  }
}
