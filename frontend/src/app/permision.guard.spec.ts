import { TestBed } from '@angular/core/testing';

import { PermisionGuard } from './permision.guard';

describe('PermisionGuard', () => {
  let guard: PermisionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PermisionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
