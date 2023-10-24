import { TestBed } from '@angular/core/testing';

import { ADM4vsADN5Service } from './adm4vs-adn5.service';

describe('ADM4vsADN5Service', () => {
  let service: ADM4vsADN5Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ADM4vsADN5Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
