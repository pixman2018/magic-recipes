import { inject } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { DocumentReference, Firestore } from '@angular/fire/firestore';

export abstract class HttpBasesAbstractClass {
  protected afs: AngularFirestore = inject(AngularFirestore);
  protected dbPath: string = '';
  protected firebase = inject(Firestore);

  constructor() {}

  public abstract getAll(): Promise<{}[]>;
  public abstract getById(id: string): Promise<{} | undefined>;
  public abstract create(
    item: any
  ): Promise<string | undefined>;
  public abstract edit(id: string, changes: Partial<any>): Promise<void>;
  public abstract delete(id: string): Promise<void>;
}
