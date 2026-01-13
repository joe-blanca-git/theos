import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaMyAccountComponent } from './ava-my-account.component';

describe('AvaMyAccountComponent', () => {
  let component: AvaMyAccountComponent;
  let fixture: ComponentFixture<AvaMyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaMyAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvaMyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
