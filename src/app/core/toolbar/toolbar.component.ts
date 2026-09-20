import { Component, OnInit, Input, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AppState } from 'src/app/shared/models/app-state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/shared/services/data.service';
import { MeasurementType } from 'src/app/shared/models/measurement';

export enum Tool {
  move = "move",
  pointer = "pointer",
  measure = "measure",
}

export enum Panel {
  none = "none",
  messages = "messages",
  player = "player",
}

export interface PanelChange {
  panel: Panel;
  open: boolean;
}

export interface MeasurementToolOptions {
  type: MeasurementType;
  save: boolean;
}

const panelStorageKeys: Record<Panel.messages | Panel.player, string> = {
  [Panel.messages]: "messagesPanelOpen",
  [Panel.player]: "playerPanelOpen",
};

export function savedPanelState(panel: Panel.messages | Panel.player): boolean {
  const value = localStorage.getItem(panelStorageKeys[panel]);
  if (value !== null) return value === "true";

  // Migrate the older single-panel preference without breaking existing users.
  return localStorage.getItem("activePanel") === panel;
}

export function savePanelState(panel: Panel.messages | Panel.player, open: boolean): void {
  localStorage.setItem(panelStorageKeys[panel], String(open));
}

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    standalone: false
})
export class ToolbarComponent implements OnInit {

  @Input() 
  public state: AppState;

  @Input() 
  public unreadMessages = 0;

  @Output()
  public action = new EventEmitter<string>();

  @Output()
  public tool = new EventEmitter<Tool>();

  @Output()
  public panel = new EventEmitter<PanelChange>();

  @Output()
  public measurementOptions = new EventEmitter<MeasurementToolOptions>();

  get showExit(): boolean {
    return this.state.device != null
  }

  constructor(private element: ElementRef, private modalService: NgbModal, private dataService: DataService) { }

  activeTool: Tool = Tool.move;
  measurementType: MeasurementType = MeasurementType.precise;
  saveMeasurements: boolean = false;
  readonly MeasurementType = MeasurementType;

  messages: Boolean = false;
  player: Boolean = false;
  videoControlsVisible: Boolean = false;
  videoPaused: boolean = false;
  videoMuted: boolean = true;

  activeToolChanged(newTool) {
    this.tool.emit(newTool);
  }

  measurementTypeChanged(type: MeasurementType) {
    this.measurementType = type;
    localStorage.setItem('measurementType', type);
    this.emitMeasurementOptions();
  }

  saveMeasurementsChanged(save: boolean) {
    this.saveMeasurements = save;
    localStorage.setItem('saveMeasurements', String(save));
    this.emitMeasurementOptions();
  }

  private emitMeasurementOptions() {
    this.measurementOptions.emit({ type: this.measurementType, save: this.saveMeasurements });
  }

  messagesChanged(newValue: boolean) {
    savePanelState(Panel.messages, newValue);
    this.panel.emit({ panel: Panel.messages, open: newValue });
  }

  playerChanged(newValue: boolean) {
    savePanelState(Panel.player, newValue);
    this.panel.emit({ panel: Panel.player, open: newValue });
  }

  showSettings() {
    this.action.emit("showSettings");
  }

  showAbout() {
    this.action.emit("showAbout");
  }

  reload() {
    this.action.emit("reload");
  }

  exit() {
    this.action.emit("exit");
  }

  videoPauseToggle() {
    this.videoPaused = !this.videoPaused;
    this.dataService.updateVideoPaused(this.videoPaused);
  }

  videoMuteToggle() {
    this.videoMuted = !this.videoMuted;
    this.dataService.updateVideoMuted(this.videoMuted);
  }

  ngOnInit() {
    this.messages = savedPanelState(Panel.messages);
    this.player = savedPanelState(Panel.player);
    this.measurementType = localStorage.getItem('measurementType') == MeasurementType.grid
      ? MeasurementType.grid
      : MeasurementType.precise;
    this.saveMeasurements = localStorage.getItem('saveMeasurements') === 'true';

    this.dataService.videoMuted.subscribe(value => this.videoMuted);
    this.dataService.videoPaused.subscribe(value => this.videoPaused);
  }
}
