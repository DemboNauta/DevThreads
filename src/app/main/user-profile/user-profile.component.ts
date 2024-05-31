import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { ListaTweetsComponent } from '../lista-tweets/lista-tweets.component';
import { UserDataService } from '../../services/user-data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserProfileService } from '../../services/user-profile.service';
import { TweetsService } from '../../services/tweets.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterUserService } from '../../services/register-user.service';
import { DirectMessagesService } from '../../services/direct-messages.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ListaTweetsComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User;
  fechaUnion: string;
  username: string;
  cargado = false;
  loggedInUser: User;
  followingUser = false;
  followingList: number[] = [];
  userSubscription: Subscription;
  profileForm: FormGroup;

  constructor(
    private router: Router,
    private userProfileService: UserProfileService,
    private activatedRoute: ActivatedRoute,
    private tweetsService: TweetsService,
    private userDataService: UserDataService,
    private changeDetectorRef: ChangeDetectorRef,
    private modalService: NgbModal,
    private registerUserService: RegisterUserService,
    private directMessageService: DirectMessagesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.username = params.get('username');
      this.loadUserData();
      this.tweetsService.getTweets(this.username);
    });

    this.userDataService.getLoggedInUser().subscribe(user => {
      this.loggedInUser = user;
      this.getFollowing();
      
      this.profileForm = this.fb.group({
        user_name: [this.loggedInUser.user_name],
        email_address: [this.loggedInUser.email_address, Validators.email],
        first_name: [this.loggedInUser.first_name],
        last_name: [this.loggedInUser.last_name],
        phonenumber: [this.loggedInUser.phonenumber, Validators.pattern("[0-9]{9}")],
        password: [''],
        user_image: ['']
      });
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  getFollowing() {
    if (this.loggedInUser) {
      this.userProfileService.getUserFollowing(this.loggedInUser.user_id).subscribe(followingIds => {
        this.followingList = followingIds;
        this.checkFollowing();
      });
    }
  }

  loadUserData(): void {
    this.userProfileService.getUserByUsername(this.username).subscribe(
      (user: User) => {
        this.userProfileService.userProfileLoaded=user;
        this.user = user;
        const dateObject: Date = new Date(user.created_at);
        const mes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        this.fechaUnion = `${dateObject.getDate()} de ${mes[dateObject.getMonth()]} del ${dateObject.getFullYear()}`;
        this.getFollowing();
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
    this.followingUser=false;
    for(let followingId of this.followingList){
      if(this.user.user_id==followingId){
        this.followingUser=true;
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  onEditModal(content: any) {
    this.modalService.dismissAll();
    this.modalService.open(content, { windowClass: "editModal" });
  }

  imageToBlob(file: File, maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          if (context) {
            context.drawImage(img, 0, 0, width, height);
            const base64String = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
            resolve(base64String);
          } else {
            reject(new Error('Error al obtener el contexto del lienzo'));
          }
        };
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  updateProfile() {
    const touchedFields: any = {};
    for (const controlName in this.profileForm.controls) {
      if (this.profileForm.controls[controlName].touched && this.profileForm.controls[controlName].value !== '') {
        if(this.profileForm.value[controlName]!=''){
          touchedFields[controlName] = this.profileForm.value[controlName];
        }
      }
    }

    const profileImageInput = document.getElementById('user_image') as HTMLInputElement;
    const imageFile = profileImageInput.files ? profileImageInput.files[0] : null;

    if (imageFile) {
      this.imageToBlob(imageFile, 200, 200).then((blob) => {
        touchedFields['user_image'] = blob;
        this.updateUserProfile(touchedFields);
      }).catch(error => {
        console.error('Error al convertir la imagen:', error);
      });
    } else {
      this.updateUserProfile(touchedFields);
    }
  }

  updateUserProfile(touchedFields: any) {
    const copyUser: User = { ...this.loggedInUser, ...touchedFields };
    this.registerUserService.updateUser(copyUser).subscribe(res => {
      console.log(res);
      this.loadUserData();
      this.userDataService.setLoggedInUser(copyUser);
      this.ngOnInit()
      this.modalService.dismissAll()
    });
  }

  onDirectMessages(){
    this.directMessageService.emitOpenMessages()
  }
}
