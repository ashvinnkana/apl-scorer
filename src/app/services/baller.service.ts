import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Baller } from '../models/baller.model';

@Injectable({
  providedIn: 'root'
})
export class BallerService {
  private dbPath = '/apl-bowlers';
  private playerRef:AngularFirestoreCollection<Baller>;

  constructor(private db: AngularFirestore) {
    this.playerRef = db.collection(this.dbPath)
  }

  getAll(): AngularFirestoreCollection<Baller> {
    return this.playerRef;
  }
  
  create(team: any): any {
    return this.playerRef.add({ ...team });
  }

  update(id: string, data: any): Promise<void> {
    return this.playerRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.playerRef.doc(id).delete();
  }
}
