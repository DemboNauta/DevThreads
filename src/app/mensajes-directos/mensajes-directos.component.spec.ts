import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesDirectosComponent } from './mensajes-directos.component';

describe('MensajesDirectosComponent', () => {
  let component: MensajesDirectosComponent;
  let fixture: ComponentFixture<MensajesDirectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajesDirectosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MensajesDirectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
