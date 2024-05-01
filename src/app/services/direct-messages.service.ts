import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DirectMessage } from '../main/interfaces/direct-message.interface';
import { DirectMessageUser } from '../main/interfaces/direct.message-user.interface';
import { UserSmall } from '../main/interfaces/userSmall.interface';

@Injectable({
  providedIn: 'root'
})
export class DirectMessagesService {

 

  constructor(private http: HttpClient) { }

  getDirectMessages(user_id: number): Observable<DirectMessageUser[]> {
    let apiUrl = `http://localhost/direct-messages.php?user_id=${user_id}`; 
    return this.http.get<DirectMessageUser[]>(apiUrl);

  }
  
  getConversation(user_id: number, sender_id: number): Observable<DirectMessage[]> {
      let apiUrl = `http://localhost/direct-messages.php?user_id=${user_id}&sender_id=${sender_id}`; 
      return this.http.get<DirectMessage[]>(apiUrl);
  }

  sentMessage(user_id: number, receiver_id: number, message: string){
    let apiUrl = `http://localhost/direct-messages.php?user_id=${user_id}&receiver_id=${receiver_id}`; 
    return this.http.post<any>(apiUrl, message);

  }

  getUserByUsername(username: string) {
    return this.http.get<UserSmall[]>('http://localhost/getUserByUsername.php?shortUsername=' + username);
  }
}
