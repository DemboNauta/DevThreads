import { TestBed } from '@angular/core/testing';

import { TweetUploadService } from './tweet-upload.service';

describe('TweetUploadService', () => {
  let service: TweetUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweetUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
