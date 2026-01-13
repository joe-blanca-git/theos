import { Routes } from "@angular/router";
import { LandingPageAppComponent } from "./landing-page.app.component";
import { LandingHomeComponent } from "./pages/landing-home/index/landing-home.component";
import { LandingAboutUsComponent } from "./pages/landing-about-us/landing-about-us.component";
import { LandingTeachersComponent } from "./pages/landing-teachers/landing-teachers.component";
import { LandingRegisterComponent } from "./pages/landing-register/index/landing-register.component";

export const LANDINGPAGE_ROUTES: Routes = [
    {
        path: '',
        component: LandingPageAppComponent,
        children:[
            {
                path: 'home', component: LandingHomeComponent
            },
            {
                path: 'about-us', component: LandingAboutUsComponent
            },
            {
                path: 'teachers', component: LandingTeachersComponent
            },
             {
                path: 'register', component: LandingRegisterComponent
            },
        ]
    }
]