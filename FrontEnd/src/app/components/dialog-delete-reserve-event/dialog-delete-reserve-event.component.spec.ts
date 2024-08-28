import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteReserveEventComponent } from './dialog-delete-reserve-event.component';

describe('DialogDeleteReserveEventComponent', () => {
  let component: DialogDeleteReserveEventComponent;
  let fixture: ComponentFixture<DialogDeleteReserveEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogDeleteReserveEventComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDeleteReserveEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
