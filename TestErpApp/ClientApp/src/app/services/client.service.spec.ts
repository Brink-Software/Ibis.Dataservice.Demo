import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ClientService } from './client.service';
import { NotificationModel } from '../models/notification';
import { provideHttpClient } from '@angular/common/http';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: 'BASE_URL', useValue: 'http://localhost/' },
      ],
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GetFile with correct URL and headers', () => {
    const notification: NotificationModel = {
      dataUrl: 'http://example.com',
      token: 'token',
    } as NotificationModel;
    const subscriptionKey = 'key';
    const jsonOrXml = true;

    service.GetFile(notification, subscriptionKey, jsonOrXml).subscribe();

    const req = httpMock.expectOne('http://example.com');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Ocp-Apim-Subscription-Key')).toBe(
      subscriptionKey,
    );
    expect(req.request.headers.get('Accept')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
  });

  it('should call getNotifications with correct URL', () => {
    service.getNotifications().subscribe();

    const req = httpMock.expectOne('http://localhost/notifications');
    expect(req.request.method).toBe('GET');
  });

  it('should call getKey with correct URL', () => {
    service.getKey().subscribe();

    const req = httpMock.expectOne('http://localhost/key');
    expect(req.request.method).toBe('GET');
  });

  it('should call saveKey with correct URL and body', () => {
    const key = 'testKey';

    service.saveKey(key).subscribe();

    const req = httpMock.expectOne('http://localhost/key');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ key: key });
  });

  it('should call clearNotifications with correct URL', () => {
    service.clearNotifications().subscribe();

    const req = httpMock.expectOne('http://localhost/notifications');
    expect(req.request.method).toBe('DELETE');
  });

  it('should call updateStatus with correct URL and body', () => {
    const applicationName = 'app';
    const fileId = '1c03adaa-7aee-48e6-a53c-21eaac9e8908';
    const utcdateversion = '2021-01-01T00:00:00.000Z';
    const notification: NotificationModel = {
      dataUrl: `https://example.com/public/applications/${applicationName}/files/${fileId}?version=${utcdateversion}`,
      token: 'token',
    } as NotificationModel;
    const processedStatus = 'processed';
    const comments = 'comments';
    const subscriptionKey = 'key';
    const jsonOrXml = true;

    service.updateStatus(
      utcdateversion,
      notification.dataUrl,
      {
        processedStatus,
        comments
      },
      subscriptionKey,
      jsonOrXml,
      notification.token
    );

    const req = httpMock.expectOne(
      `https://example.com/public/applications/${applicationName}/files/${fileId}/status?version=${utcdateversion}`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      processedStatus,
      comments,
    });
  });
});
