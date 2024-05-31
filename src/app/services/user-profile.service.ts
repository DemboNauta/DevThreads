import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../main/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private userSubject = new Subject<User>();
  userProfileLoaded: User;
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserByUsername(username: string) {
    return this.http.get<User>('https://devthreads.es/backend/getUserByUsername.php?username=' + username);
  }

  setUserByUsername(username: string) {
    this.getUserByUsername(username).subscribe(
      (user: User) => {
        this.userSubject.next(user);
        this.userProfileLoaded=user;
      },
      (error) => {
        console.error('Error al obtener datos del usuario:', error);
      }
    );
  }


  followUser(follower_id: number, following_id: number){
    return this.http.get(`https://devthreads.es/backend/followUser.php?follower_id=${follower_id}&following_id=${following_id}`);

  }

  getUserFollowing(user_id: number){
    return this.http.get<number[]>(`https://devthreads.es/backend/get-followers.php?user_id=${user_id}`);

  }
}