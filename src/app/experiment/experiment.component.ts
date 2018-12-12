import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, HostListener } from '@angular/core';
import { interval } from 'rxjs';
import { KeyboardComponent } from '../keyboard/keyboard.component';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})

export class ExperimentComponent implements AfterViewInit {
  @ViewChildren(KeyboardComponent) public keyboards: QueryList<KeyboardComponent>;
  private keyboard: KeyboardComponent;
  private controller: Gamepad;
  private selectBtnPressedDown: Boolean;
  public keyboardInputText: String;
  private sampleTexts: Array<String>;

  constructor() {
    this.keyboardInputText = "";
    this.controller = null;
    this.selectBtnPressedDown = false;
  }

  ngAfterViewInit() {
    this.keyboard = this.keyboards.first;
    interval(100).subscribe(() => this.getGamePadStatus());
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "ArrowUp") this.keyboard.moveCursor("up");
    else if (event.key === "ArrowDown") this.keyboard.moveCursor("down");
    else if (event.key === "ArrowLeft") this.keyboard.moveCursor("left");
    else if (event.key === "ArrowRight") this.keyboard.moveCursor("right");
    else if (event.key === "Enter") {
      this.keyboard.selectKey();
      this.keyboardInputText = this.keyboard.keyboardInputText;
      //console.log(event.timeStamp);
    }
  }

  getGamePadStatus() {
    this.controller = navigator.getGamepads()[0] ? navigator.getGamepads()[0] : null;
    if (this.controller == null) return;
    if (this.selectBtnPressedDown && !this.controller.buttons[0].pressed) {
      this.selectBtnPressedDown = false;
    }
    let [leftAnalogX, leftAnalogY, rightAnalogX, rightAnalogY] = this.controller.axes;
    if (leftAnalogX == -1) {
      // left
      this.keyboard.moveCursor('left');
    }
    if (leftAnalogX == 1) {
      // right
      this.keyboard.moveCursor('right');
    }
    if (leftAnalogY == 1) {
      // down
      this.keyboard.moveCursor('down');
    }
    if (leftAnalogY == -1) {
      // up
      this.keyboard.moveCursor('up');
    }
    if (rightAnalogX == -1) {
      // left
      this.keyboard.moveCursor('left');
    }
    if (rightAnalogX == 1) {
      // right
      this.keyboard.moveCursor('right');
    }
    if (rightAnalogY == 1) {
      // down
      this.keyboard.moveCursor('down');
    }
    if (rightAnalogY == -1) {
      // up
      this.keyboard.moveCursor('up');
    }
    if (this.controller.buttons[0].pressed) {
      // A is pressed
      if (this.selectBtnPressedDown) {
        return;
      }
      this.selectBtnPressedDown = true;
      this.keyboard.selectKey();
      this.keyboardInputText = this.keyboard.keyboardInputText;
    }
  }
}
