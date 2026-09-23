import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { entityFrameAction, rollCommand } from 'src/app/shared/entity-frame-interactions';
import { Message, MessageType } from 'src/app/shared/models/message';
import { WSEventName } from 'src/app/shared/models/wsevent';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
    selector: 'app-entity-modal',
    templateUrl: './entity-modal.component.html',
    styleUrls: ['./entity-modal.component.scss'],
    standalone: false
})
export class EntityModalComponent {

  @Input()
  reference: string;
  @Input()
  title = 'Entity';

  referencePopup?: string;
  referencePopupTitle = 'Reference';

  get url() {
    return `${this.dataService.baseURL}${this.reference}`
  }

  get referencePopupUrl(): string | undefined {
    return this.referencePopup ? `${this.dataService.baseURL}${this.referencePopup}` : undefined;
  }

  constructor(public modalInstance: NgbActiveModal, private dataService: DataService) {}

  frameLoaded(frame: HTMLIFrameElement): void {
    try {
      const frameDocument = frame.contentDocument;
      if (!frameDocument || frameDocument.documentElement.dataset['webClientInteractions'] === 'true') return;
      frameDocument.documentElement.dataset['webClientInteractions'] = 'true';
      frameDocument.addEventListener('click', event => this.handleFrameClick(event), true);
    } catch (error) {
      console.debug('Unable to attach entity frame interactions', error);
    }
  }

  closeReferencePopup(): void {
    this.referencePopup = undefined;
    this.referencePopupTitle = 'Reference';
  }

  private handleFrameClick(event: MouseEvent): void {
    const target = event.target as Element | null;
    if (!target || typeof target.closest !== 'function') return;

    const anchor = target.closest('a') as HTMLAnchorElement | null;
    if (!anchor) return;

    const action = entityFrameAction(anchor, this.dataService.baseURL);
    if (!action) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (action.kind === 'reference') {
      this.referencePopup = action.reference;
      this.referencePopupTitle = action.title;
      return;
    }

    const message = new Message();
    message.source = localStorage.getItem('userName') || 'Unknown';
    message.color = localStorage.getItem('userColor');
    message.type = MessageType.command;
    message.content = rollCommand(action);
    this.dataService.send({ name: WSEventName.createMessage, data: message });
  }
}
