import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'phoenician',
  templateUrl: './phoenician.component.html',
  styleUrls: ['./phoenician.component.scss']
})
export class PhoenicianComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public contentChanged(event: Event) {
    console.log('contentChanged', event);
  }
}
