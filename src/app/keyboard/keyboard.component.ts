import { Component, OnInit, Input, HostListener } from '@angular/core';
import Keyboard from "../../../node_modules/simple-keyboard/build/index";
import keyNavigation from "../../../node_modules/simple-keyboard-key-navigation";
import { KeyNavControls } from '../key-nav-controls';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {
  @Input() keyboardLayout: String[];
  @Input() navigationControls: KeyNavControls;

  private keyboard: Keyboard;

  constructor() {
  }

  ngOnInit() {
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      layout: this.keyboardLayout,
      enableKeyNavigation: true,
      modules: [keyNavigation],
      onModulesLoaded: () => {
        console.log("Keyboard loaded!");
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "ArrowUp") this.keyboard.modules.keyNavigation.up();
    else if (event.key === "ArrowDown") this.keyboard.modules.keyNavigation.down();
    else if (event.key === "ArrowLeft") this.keyboard.modules.keyNavigation.left();
    else if (event.key === "ArrowRight") this.keyboard.modules.keyNavigation.right();
    else if (event.key === "Enter") this.keyboard.modules.keyNavigation.press();
    console.log(event.key);
  }

  onChange(input) {
    //document.querySelector(".input").value = input;
    console.log("Input changed", input);
  }

  onKeyPress(button) {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  }

  handleShift() {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  }

}
