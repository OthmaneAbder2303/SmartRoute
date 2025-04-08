import { TestBed } from '@angular/core/testing';

import { NewAuthService } from './new-auth.service';

describe('NewAuthServiceService', () => {
  let service: NewAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
