import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CollegeListComponent } from './college-list/college-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CollegeListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'xello-senior-web-dev-takehome-web';
}
