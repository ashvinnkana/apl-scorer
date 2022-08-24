import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Batsman } from '../models/batsman.model';

@Injectable({
  providedIn: 'root'
})
export class BatsmanService {
  private dbPath = '/apl-batsmans';
  private playerRef:AngularFirestoreCollection<Batsman>;

  constructor(private db: AngularFirestore) {
    this.playerRef = db.collection(this.dbPath)
  }

  getAll(): AngularFirestoreCollection<Batsman> {
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
