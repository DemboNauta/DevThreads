import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { UserProfileComponent } from './sidebars/user-profile/user-profile.component';

export const routes: Routes = [
    { path: '', redirectTo: 'main', pathMatch: 'full'},
    { path: 'main', component: MainComponent},
    { path: 'profile/:username', component: UserProfileComponent},
    { path: 'profile', component: UserProfileComponent}
];
