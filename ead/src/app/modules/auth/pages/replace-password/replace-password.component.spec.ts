import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacePasswordComponent } from './replace-password.component';

describe('ReplacePasswordComponent', () => {
  let component: ReplacePasswordComponent;
  let fixture: ComponentFixture<ReplacePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplacePasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplacePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
