import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionCreateComponent } from './auction-create.component';

describe('AuctionCreate', () => {
  let component: AuctionCreateComponent;
  let fixture: ComponentFixture<AuctionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuctionCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
