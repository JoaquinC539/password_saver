import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NewMasterComponent } from './new-master/new-master.component';
import { PasswordManagerComponent } from './password-manager/password-manager.component';

export const routes: Routes = [
    {path:"login",component:LoginComponent},
    {path:"new",component:NewMasterComponent},
    {path:"manager",component:PasswordManagerComponent}
];
