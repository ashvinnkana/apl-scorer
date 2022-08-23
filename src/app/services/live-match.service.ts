import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Match } from '../models/match.model';

@Injectable({
  providedIn: 'root'
})
export class LiveMatchService {

  private dbPath = '/apl-live-match';
  private matchRef:AngularFirestoreCollection<Match>;

  constructor(private db: AngularFirestore) {
    this.matchRef = db.collection(this.dbPath)
  }

  getAll(): AngularFirestoreCollection<Match> {
    return this.matchRef;
  }
  
  create(match: any): any {
    return this.matchRef.add({ ...match });
  }

  update(id: string, data: any): Promise<void> {
    return this.matchRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.matchRef.doc(id).delete();
  }
}
