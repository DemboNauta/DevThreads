import { TestBed } from '@angular/core/testing';

import { TweetEventServiceService } from './tweet-event.service';

describe('TweetEventServiceService', () => {
  let service: TweetEventServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweetEventServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
