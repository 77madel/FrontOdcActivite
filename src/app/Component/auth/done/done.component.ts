import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-done',
    imports: [
        FormsModule,
        RouterLink,
    ],
    templateUrl: './done.component.html',
    styleUrl: './done.component.scss'
})
export class DoneComponent {

}
