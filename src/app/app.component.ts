import { Component, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { ExperimentComponent } from './experiment/experiment.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // @ViewChildren(ExperimentComponent) public experiments: QueryList<ExperimentComponent>;
  // private controllerConnected: Boolean;
  // private experimentComp: ExperimentComponent;
  title = 'app';

  // constructor() {
  //   this.controllerConnected = false;
  //   this.experimentComp = null;
  // }

  // ngAfterViewInit() {
  //   this.experiments.changes.subscribe((comps: QueryList <ExperimentComponent>) =>
  //       {
  //           this.experimentComp = comps.first;
  //       });
  //   console.log(this.experimentComp);
  //   //this.controllerConnected = this.experiments.first.controllerConnected;
  // }
}
