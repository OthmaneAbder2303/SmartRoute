import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OauthRedirectComponent } from './oauth-redirect.component';

describe('OauthRedirectComponent', () => {
  let component: OauthRedirectComponent;
  let fixture: ComponentFixture<OauthRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthRedirectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OauthRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
