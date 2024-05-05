import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { EditorComponent } from './editor/editor.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MenuComponent, EditorComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
