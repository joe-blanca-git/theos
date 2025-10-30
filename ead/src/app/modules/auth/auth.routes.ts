import { Routes } from "@angular/router";
import { AuthAppComponent } from "./auth.app.component";
import { LoginComponent } from "./pages/login/login.component";
import { MenuAuthComponent } from "./pages/menu-auth/menu-auth.component";

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: AuthAppComponent,
        children: [
            {
                path: 'menu-auth', component: MenuAuthComponent
            },
            {
                path: 'login', component: LoginComponent
            }
        ]
    }
]