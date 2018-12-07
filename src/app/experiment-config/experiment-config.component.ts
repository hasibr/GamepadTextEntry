import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-experiment-config',
  templateUrl: './experiment-config.component.html',
  styleUrls: ['./experiment-config.component.css']
})
export class ExperimentConfigComponent implements OnInit {

  public submitted = false;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
  }
  

}
