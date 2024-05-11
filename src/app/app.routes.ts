import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { UserProfileComponent } from './main/user-profile/user-profile.component';
import { FollowingComponent } from './main/following/following.component';

export const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full'},
    { path: 'main', component: MainComponent},
    { path: 'profile/:username', component: UserProfileComponent},
    { path: 'profile', component: UserProfileComponent},
    { path: 'seguidos', component: FollowingComponent}
];
