import { Component } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { EditorComponent } from './editor/editor.component';
import { ContentFormComponent } from './content-form/content-form.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ContentFormComponent, MenuComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
