import { Component, OnInit, Input } from '@angular/core';
import Keyboard from "../../../node_modules/simple-keyboard/build/index";
import keyNavigation from "../../../node_modules/simple-keyboard-key-navigation";
import { KeyNavControls } from '../key-nav-controls';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent {
  @Input() keyboardName: String;
  @Input() keyboardLayout: String[];
  @Input() navigationControls: KeyNavControls;
  private keyboard: Keyboard;
  public keyboardInputText: String;

  constructor() {
    this.keyboardInputText = null;
  }

  ngAfterViewInit() {
    this.keyboardName = this.keyboardName ? this.keyboardName : "simple-keyboard";
    let kbName = this.keyboardName ? "." + this.keyboardName : null;
    this.keyboard = new Keyboard(kbName, {
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      theme: "simple-keyboard hg-theme-default hg-layout-default",
      layout: this.keyboardLayout,
      enableKeyNavigation: true,
      modules: [keyNavigation],
      onModulesLoaded: () => { }
    });
  }

  public moveCursor(direction: String) {
    switch (direction) {
      case "up": {
        this.keyboard.modules.keyNavigation.up();
        break;
      }
      case "down": {
        this.keyboard.modules.keyNavigation.down();
        break;
      }
      case "left": {
        this.keyboard.modules.keyNavigation.left();
        break;
      }
      case "right": {
        this.keyboard.modules.keyNavigation.right();
        break;
      }
      default: {
        break;
      }
    }
  }

  public selectKey() {
    this.keyboard.modules.keyNavigation.press();
  }

  private onChange(input) {
    this.keyboardInputText = input;
  }

  private onKeyPress(button) {
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  }

  private handleShift() {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  }

}
