import { EntityModalComponent } from './entity-modal.component';

describe('EntityModalComponent', () => {
  it('should create', () => {
    const component = new EntityModalComponent(
      { baseURL: 'http://127.0.0.1:8080' } as any,
      { detectChanges: () => undefined } as any,
      { run: callback => callback() } as any,
    );
    expect(component).toBeTruthy();
  });
});
