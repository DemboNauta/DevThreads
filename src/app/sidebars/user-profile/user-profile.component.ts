import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { User } from '../../main/interfaces/user.interface';
import { ListaTweetsComponent } from '../../main/lista-tweets/lista-tweets.component';
import { UserDataService } from '../../services/user-data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserProfileService } from '../../services/user-profile.service';
import { TweetsService } from '../../services/tweets.service';
import { MensajesDirectosComponent } from '../../mensajes-directos/mensajes-directos.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ListaTweetsComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})


  export class UserProfileComponent implements OnDestroy {

    user: User;
    fechaUnion: string;
    username: string;
    cargado = false;
    loggedInUser: User;
    followingUser = false;
    followingList: number[] = [];
    userSubscription: Subscription;
    profileForm: FormGroup;
    touchedFields: any = {};
  
    constructor(
      private router: Router,
      private userProfileService: UserProfileService,
      private activatedRoute: ActivatedRoute,
      private tweetsService: TweetsService,
      private userDataService: UserDataService,
      private changeDetectorRef: ChangeDetectorRef,
      private modalService: NgbModal,
      private fb: FormBuilder

    ) {}
  
    ngOnInit(): void {

      
  
      this.userSubscription = this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
        this.username = params.get('username');
        this.loadUserData();
      });
  
      this.userDataService.getLoggedInUser().subscribe(user => {
        this.loggedInUser = user;
        this.getFollowing();

        this.profileForm = new FormGroup({
          user_name: new FormControl(this.loggedInUser.user_name),
          email_address: new FormControl(this.loggedInUser.email_address, Validators.email),
          first_name: new FormControl(this.loggedInUser.first_name),
          last_name: new FormControl(this.loggedInUser.last_name),
          phonenumber: new FormControl(this.loggedInUser.phonenumber, Validators.pattern("[0-9]{9}")),
          passwordRegister: new FormControl(''),
          confirmPassword: new FormControl(''),
          profileImage: new FormControl('')
        });
      });
    }
  
    ngOnDestroy(): void {
      this.userSubscription.unsubscribe();
    }
  
    getFollowing() {
      if(this.loggedInUser){
        this.userProfileService.getUserFollowing(this.loggedInUser.user_id).subscribe(followingIds => {
          this.followingList = followingIds;
          this.checkFollowing();
        });
      }
      
    }
  
    loadUserData(): void {
      this.userProfileService.getUserByUsername(this.username).subscribe(
        (user: User) => {
          this.user = user;
          const dateObject: Date = new Date(user.created_at);
          const mes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          this.fechaUnion = `${dateObject.getDate()} de ${mes[dateObject.getMonth()]} del ${dateObject.getFullYear()}`;
          this.getFollowing()
          this.cargado = true;
        },
        (error) => {
          console.error('Error al obtener los datos del usuario:', error);
        }
      );
    }
  
    onFollowUser() {
      this.userProfileService.followUser(this.loggedInUser.user_id, this.user.user_id).subscribe(() => {
        this.loadUserData();
        this.getFollowing();
      });
    }
  
    checkFollowing() {
      let found = false;
      for (let index = 0; index < this.followingList.length; index++) {
        if (this.followingList[index] == this.user.user_id) {
          found = true;
          break;
        }
      }
      this.followingUser = found;
      this.changeDetectorRef.detectChanges();
    }

    closeModal(){
      this.modalService.dismissAll()
    }


    onEditModal(content: any) {
      this.modalService.dismissAll();
      
      this.modalService.open(content, {windowClass: "editModal"});
      
    }

    updateProfile() {
      
        const touchedFields = {};
        for (const controlName in this.profileForm.controls) {
          if (this.profileForm.controls[controlName].touched && this.profileForm.controls[controlName].value != '') {
            touchedFields[controlName] = this.profileForm.value[controlName];
          }
        }
        console.log('Campos tocados:', touchedFields);
      
    }
  }