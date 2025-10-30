import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'auth-app-root',
    template: '<router-outlet></router-outlet>',
    styleUrls: ['auth.app.component.scss',],
    standalone: true,
    imports:[RouterOutlet]
})
export class AuthAppComponent {

}