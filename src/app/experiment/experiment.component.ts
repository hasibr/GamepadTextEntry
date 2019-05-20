import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, HostListener, Input } from '@angular/core';
import { interval } from 'rxjs';
import { KeyboardComponent } from '../keyboard/keyboard.component';
import { shuffleArray } from "../utils";
import sampleTexts from "../fixtures/sampleTexts";
import { AnalyticsInterface } from "../interfaces/analyticsInterface"
import { TimeDataInterface } from "../interfaces/timeDataInterface"

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html',
  styleUrls: ['./experiment.component.css']
})
export class ExperimentComponent implements OnInit, AfterViewInit {
  // Keyboard variables
  @ViewChildren(KeyboardComponent) public keyboards: QueryList<KeyboardComponent>;
  private allKeyboards: QueryList<KeyboardComponent>;
  private activeKeyboard: KeyboardComponent;
  public keyboardInputText: String;

  // Gamepad variables
  private controller: Gamepad;
  public controllerConnected: Boolean;
  private selectBtnPressedDown: Boolean;
  readonly ANALOG_AXIS_THRESHOLD = 0.6;

  // Experiment variables
  private dualKeyboard = true;
  public startedTest = false;
  public completedTest = false;
  private startedEnteringPhrase = false;
  private submitPromptShowing = false;
  private phrasesCompleted = 0;
  private trials = 10;
  private cursor = 1;
  private progress = 0;
  private phrases = shuffleArray(sampleTexts).slice(0, this.trials);
  private phrase: String;
  public timeData: AnalyticsInterface;

  @Input()
  analytics: Array<AnalyticsInterface> = [];

  @Input()
  leftKeyboardLayout: Array<String> = [
    "` 1 2 3 4 5",
    "{tab} q w e r t",
    "{lock} a s d f g",
    "{shift} z x c v b",
    ".com @ {space}"
  ];

  @Input()
  rightKeyboardLayout: Array<String> = [
    "6 7 8 9 0 - = {bksp}",
    "y u i o p [ ] \\",
    "h j k l ; ' {enter}",
    "n m , . / {shift}",
    "{space}"
  ];

  // Carousel controls
  nextSlide: HTMLElement;
  prevSlide: HTMLElement;
  progressBar: HTMLElement;

  // Confirmation modal
  modalBtn: HTMLElement;

  constructor() {
    this.keyboardInputText = "";
    this.controller = null;
    this.controllerConnected = false;
    this.selectBtnPressedDown = false;
    this.phrase = this.phrases[0];
    this.timeData = null;
    this.analytics = [];
  }
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.allKeyboards = this.keyboards;
    this.activeKeyboard = this.keyboards.first;
    this.nextSlide = document.getElementById("carouselNext") as HTMLElement;
    this.prevSlide = document.getElementById("carouselPrev") as HTMLElement;
    this.modalBtn = document.getElementById("submitPhraseBtn") as HTMLElement;
    this.progressBar = document.getElementById("progressBar") as HTMLElement;
    this.progressBar.setAttribute("style", "width: " + this.progress + "%;");
    interval(100).subscribe(() => this.getGamePadStatus());
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "ArrowUp") this.activeKeyboard.moveCursor("up");
    else if (event.key === "ArrowDown") this.activeKeyboard.moveCursor("down");
    else if (event.key === "ArrowLeft") this.activeKeyboard.moveCursor("left");
    else if (event.key === "ArrowRight") this.activeKeyboard.moveCursor("right");
    else if (event.key === "Enter") {
      this.activeKeyboard.selectKey();
      this.nextPhrase();
      this.resetPhrase();
    }
  }

  restartTest() {
    this.startedTest = false;
    this.completedTest = false;
    this.startedEnteringPhrase = false;
    this.cursor = 1;
    this.phrases = shuffleArray(sampleTexts).slice(0, this.trials);
    this.phrase = this.phrases[0];
    this.phrasesCompleted = 0;
    this.progress = 0;
    this.progressBar.setAttribute("style", "width: " + this.progress + "%;");
    this.selectBtnPressedDown = false;
    this.timeData = null;
    this.analytics = [];
    console.log("restarted test");
  }

  nextPhrase() {
    const cursor = this.cursor;
    this.phrasesCompleted++;
    if (this.cursor < this.trials) {
      this.cursor = cursor + 1;
      this.phrase = this.phrases[cursor];
    } else {
      this.completedTest = true;
      this.startedTest = false;
    }
    this.progress = Math.round((this.phrasesCompleted / this.trials) * 100);
    this.progressBar.setAttribute("style", "width: " + this.progress + "%;");
  }

  startTimer() {
    const startedEnteringPhrase = this.startedEnteringPhrase;

    if (!startedEnteringPhrase && !this.completedTest) {
      console.log("starting timer...")
      const currentPhrase = this.phrase;
      this.startedTest = true;
      this.completedTest = false;
      this.startedEnteringPhrase = true;
      this.timeData = {
        enteredPhrase: "",
        phrase: currentPhrase,
        startedOn: Date.now(),
        keys: []
      };
    }
  }

  resetPhrase() {
    console.log("reset phrase called");
    this.keyboardInputText = "";
    this.activeKeyboard.keyboard.input
    this.timeData = {
      enteredPhrase: "",
      phrase: this.phrase,
      startedOn: Date.now(),
      keys: []
    };
    this.startedEnteringPhrase = false;
    this.keyboards.forEach(item => {
      item.keyboard.clearInput();
    })
  }

  getGamePadStatus() {
    // Get active controllers - if none, return
    this.controller = navigator.getGamepads()[0] ? navigator.getGamepads()[0] : null;
    if (this.controller == null) return;
    this.controllerConnected = true;
    // Wait until user starts test (start button) to allow keyboard control
    // User must also press start to continue using gamepad once test has completed
    if (this.completedTest && !this.controller.buttons[9].pressed) return;
    if (this.completedTest && this.controller.buttons[9].pressed) {
      this.completedTest = false;
      return;
    }

    if (!this.startedTest) {
      if (this.controller.buttons[9].pressed) {
        this.startTimer();
      } else {
        return;
      }
    }

    // B button (submit phrase button)
    if (this.controller.buttons[1].pressed && !this.submitPromptShowing) {
      this.submitPromptShowing = true;
      this.modalBtn.click();
      console.log("submit prompt opened (pressed B), submitPromptShowing=" + this.submitPromptShowing);
    }

    // Y button (no do not submit, cancel modal go back to typing)
    if (this.controller.buttons[3].pressed && this.submitPromptShowing) {
      this.submitPromptShowing = false;
      this.modalBtn.click();
      console.log("submit prompt closed (pressed Y), submitPromptShowing=" + this.submitPromptShowing);
      return;
    }

    // A button (select button)
    if (this.selectBtnPressedDown && !this.controller.buttons[0].pressed) {
      this.selectBtnPressedDown = false;
    }
    if (this.controller.buttons[0].pressed) {
      if (this.selectBtnPressedDown) return;

      this.selectBtnPressedDown = true;

      this.activeKeyboard.selectKey();
      this.keyboardInputText = this.activeKeyboard.inputText;
      let keyPressData = this.activeKeyboard.keyPressData;
      keyPressData.pressedOn = keyPressData.pressedOn - this.timeData.startedOn; // timeData.startedOn is null sometimes, have to check if we started 
      this.timeData.keys.push(this.activeKeyboard.keyPressData);

      // Submit phrase confirmation (A is for yes, submit)
      if (this.submitPromptShowing) {
        const newTimeData = Object.assign({}, this.timeData, { enteredPhrase: this.keyboardInputText })
        this.analytics.push(newTimeData);
        this.nextPhrase();
        this.resetPhrase();
        this.submitPromptShowing = false;
        this.modalBtn.click();
        console.log("submit prompt closed (pressed A), submitPromptShowing=" + this.submitPromptShowing);
      }
    }


    // Cursor movements
    let [leftAnalogX, leftAnalogY, rightAnalogX, rightAnalogY] = this.controller.axes;
    if (leftAnalogX <= -this.ANALOG_AXIS_THRESHOLD) {
      // left
      this.activeKeyboard.moveCursor('left');
    }
    if (leftAnalogX >= this.ANALOG_AXIS_THRESHOLD) {
      // right
      this.activeKeyboard.moveCursor('right');
    }
    if (leftAnalogY >= this.ANALOG_AXIS_THRESHOLD) {
      // down
      this.activeKeyboard.moveCursor('down');
    }
    if (leftAnalogY <= -this.ANALOG_AXIS_THRESHOLD) {
      // up
      this.activeKeyboard.moveCursor('up');
    }

    if ((rightAnalogX <= -this.ANALOG_AXIS_THRESHOLD || rightAnalogX >= this.ANALOG_AXIS_THRESHOLD) && this.dualKeyboard) {
      let keyboardSide = null
      const lastInput = this.activeKeyboard.keyboard.getInput();

      if (rightAnalogX <= -this.ANALOG_AXIS_THRESHOLD) {
        keyboardSide = 'first';
        this.prevSlide.click();
      }

      if (rightAnalogX >= this.ANALOG_AXIS_THRESHOLD) {
        keyboardSide = 'last';
        this.nextSlide.click();
      }

      this.activeKeyboard = this.keyboards[keyboardSide];
      this.activeKeyboard.keyboard.setInput(lastInput);
    }
    if (rightAnalogX <= -this.ANALOG_AXIS_THRESHOLD && !this.dualKeyboard) {
      this.activeKeyboard.moveCursor('left');
    }
    if (rightAnalogX >= this.ANALOG_AXIS_THRESHOLD && !this.dualKeyboard) {
      this.activeKeyboard.moveCursor('right');
    }
    if (rightAnalogY >= this.ANALOG_AXIS_THRESHOLD && !this.dualKeyboard) {
      this.activeKeyboard.moveCursor('down');
    }
    if (rightAnalogY <= -this.ANALOG_AXIS_THRESHOLD && !this.dualKeyboard) {
      this.activeKeyboard.moveCursor('up');
    }
  }
}
