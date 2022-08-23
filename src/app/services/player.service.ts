import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private dbPath = '/apl-players';
  private playerRef:AngularFirestoreCollection<Player>;

  constructor(private db: AngularFirestore) {
    this.playerRef = db.collection(this.dbPath)
  }

  getAll(): AngularFirestoreCollection<Player> {
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
