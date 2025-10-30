import { Routes } from "@angular/router";
import { LandingPageAppComponent } from "./landing-page.app.component";
import { LandingHomeComponent } from "./pages/landing-home/landing-home.component";
import { LandingAboutUsComponent } from "./pages/landing-about-us/landing-about-us.component";
import { LandingTeachersComponent } from "./pages/landing-teachers/landing-teachers.component";
import { LandingPlansComponent } from "./pages/landing-plans/landing-plans.component";
import { LandingPlansBuyComponent } from "./pages/landing-plans-buy/landing-plans-buy.component";

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
                path: 'plans', component: LandingPlansComponent
            },
            {
                path: 'buy-subscription', component: LandingPlansBuyComponent
            }
        ]
    }
]