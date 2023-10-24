import { TestBed } from '@angular/core/testing';

import { AddemployeeService } from './addemployee.service';

describe('AddemployeeService', () => {
  let service: AddemployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddemployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
