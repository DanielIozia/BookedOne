import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogReserveEventComponent } from './dialog-reserve-event.component';

describe('DialogReserveEventComponent', () => {
  let component: DialogReserveEventComponent;
  let fixture: ComponentFixture<DialogReserveEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogReserveEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogReserveEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
