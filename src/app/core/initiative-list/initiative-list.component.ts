import { Component, OnInit, Input, ElementRef, AfterViewChecked, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AppState } from 'src/app/shared/models/app-state';
import { ActiveCombatant, Combatant, Role } from 'src/app/shared/models/combatant';
import { Game } from 'src/app/shared/models/game';
import { Initiative } from 'src/app/shared/models/initiative';
// import { Lightbox, IAlbum } from 'ngx-lightbox';
import { DataService } from 'src/app/shared/services/data.service';
import { LightboxService } from '../lightbox/lightbox.service';
import {
  InitiativeDockPosition,
  initiativeDockTarget,
  saveInitiativeDock,
  storedInitiativeDockLocked,
  storedInitiativeDockPosition,
} from './initiative-dock';

@Component({
    selector: 'app-initiative-list',
    templateUrl: './initiative-list.component.html',
    styleUrls: ['./initiative-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class InitiativeListComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  static el: HTMLElement | undefined;

  // @Input()
  // public game: Game;

  @Input()
  public initiativeId?: string;

  @Input()
  activeCombatants: Array<ActiveCombatant> = []

  @Input()
  messagesOpen = false;

  dockPosition: InitiativeDockPosition = storedInitiativeDockPosition();
  dockLocked = storedInitiativeDockLocked();
  dockPreview?: InitiativeDockPosition;
  dockDragging = false;

  private dockPointerId?: number;
  private dockHandle?: HTMLElement;

  constructor(private element: ElementRef, private lightboxService: LightboxService, private dataService: DataService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    // console.debug("initiative-list component checked");
  }

  ngAfterViewInit(): void {
    InitiativeListComponent.el = this.element.nativeElement;
    this.scrollToTurned();
    window.dispatchEvent(new Event('resize'));
  }

  ngOnDestroy(): void {
    this.releaseDockPointer();
    this.resetDockDrag();
    InitiativeListComponent.el = undefined;
    window.dispatchEvent(new Event('resize'));
  }

  scrollToTurned(turnedId?: string) {
    const host = InitiativeListComponent.el
    if (host == null) {
      return
    }

    // scroll to turned element
    const initiativeId = turnedId || this.initiativeId
    console.debug(initiativeId);
    const selector = `[data-id="${initiativeId}"]`;
    const el = host.querySelector(selector);
    const viewport = host.querySelector('.initiative-entries');
    if (el && viewport) {
      const box = el.getBoundingClientRect();
      const hostBox = viewport.getBoundingClientRect();

      if (box.top < hostBox.top || box.bottom > hostBox.bottom || box.left < hostBox.left || box.right > hostBox.right) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }
  }

  beginDockDrag(event: PointerEvent): void {
    if (this.dockLocked || event.button !== 0) return;

    this.dockDragging = true;
    this.dockPreview = undefined;
    this.dockPointerId = event.pointerId;
    this.dockHandle = event.currentTarget as HTMLElement;
    this.dockHandle.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  }

  previewDock(event: PointerEvent): void {
    if (!this.dockDragging || event.pointerId !== this.dockPointerId) return;

    this.dockPreview = initiativeDockTarget(
      event.clientX,
      event.clientY,
      window.innerWidth,
      window.innerHeight,
    );
    event.preventDefault();
    event.stopPropagation();
  }

  finishDockDrag(event: PointerEvent): void {
    if (!this.dockDragging || event.pointerId !== this.dockPointerId) return;

    if (this.dockPreview) {
      this.dockPosition = this.dockPreview;
      saveInitiativeDock(this.dockPosition, this.dockLocked);
      window.dispatchEvent(new Event('resize'));
    }
    this.endDockDrag(event);
  }

  cancelDockDrag(event: PointerEvent): void {
    if (!this.dockDragging || event.pointerId !== this.dockPointerId) return;
    this.endDockDrag(event);
  }

  toggleDockLock(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.dockLocked = !this.dockLocked;
    saveInitiativeDock(this.dockPosition, this.dockLocked);

    if (this.dockLocked) {
      this.releaseDockPointer();
      this.resetDockDrag();
    }
  }

  private endDockDrag(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.releaseDockPointer();
    this.resetDockDrag();
  }

  private releaseDockPointer(): void {
    if (this.dockHandle && this.dockPointerId != null && this.dockHandle.hasPointerCapture?.(this.dockPointerId)) {
      this.dockHandle.releasePointerCapture(this.dockPointerId);
    }
  }

  private resetDockDrag(): void {
    this.dockDragging = false;
    this.dockPreview = undefined;
    this.dockPointerId = undefined;
    this.dockHandle = undefined;
  }

  private getImage(index: number): string {
    return this.activeCombatants[index].combatant.image ? `${this.dataService.protocol}//${this.dataService.remoteHost}${this.activeCombatants[index].combatant.image}` : "assets/img/creature.png"
  }

  open(index: number): void {
    this.lightboxService.open(this.getImage(index), this.activeCombatants[index].combatant.name);
  }

  close(): void {
    this.lightboxService.close();
  }
}
