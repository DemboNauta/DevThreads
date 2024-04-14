import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private userIdSubject = new Subject<number>();

  userId$ = this.userIdSubject.asObservable();

  constructor() {}

  setUserId(userId: number) {
    this.userIdSubject.next(userId);
  }
}