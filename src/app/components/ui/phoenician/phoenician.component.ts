import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'phoenician',
  templateUrl: './phoenician.component.html',
  styleUrls: ['./phoenician.component.scss']
})
export class PhoenicianComponent implements OnInit {

  @ViewChild("Phoenician") elem: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

    console.log(this.elem);
    this.elem.nativeElement.innerHTML = "Hello Angular 10!";

  }
}
