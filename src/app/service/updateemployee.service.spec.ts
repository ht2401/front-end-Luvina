import { TestBed } from '@angular/core/testing';

import { UpdateemployeeService } from './updateemployee.service';

describe('UpdateemployeeService', () => {
  let service: UpdateemployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateemployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
