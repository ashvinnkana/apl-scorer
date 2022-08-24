import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Points } from '../models/points.model';

@Injectable({
  providedIn: 'root'
})
export class PointService {
  private dbPath = '/apl-points-table';
  private pointRef:AngularFirestoreCollection<Points>;

  constructor(private db: AngularFirestore) {
    this.pointRef = db.collection(this.dbPath)
  }

  getAll(): AngularFirestoreCollection<Points> {
    return this.pointRef;
  }
  
  create(team: any): any {
    return this.pointRef.add({ ...team });
  }

  update(id: string, data: any): Promise<void> {
    return this.pointRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.pointRef.doc(id).delete();
  }
}
