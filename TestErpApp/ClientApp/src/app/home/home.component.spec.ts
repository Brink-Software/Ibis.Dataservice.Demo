import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ClientService } from '../services/client.service';
import { of, throwError } from 'rxjs';
import { NotificationModel } from '../models/notification';
import { ProcessedStatus } from '../models/processedstatus';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let clientServiceMock: any;

    beforeEach(() => {
        clientServiceMock = {
            getNotifications: jest.fn().mockReturnValue(of([])),
            getKey: jest.fn().mockReturnValue(of({ key: 'test-key' })),
            GetFile: jest.fn().mockReturnValue(of('file-content')),
            saveKey: jest.fn().mockReturnValue(of(null)),
            clearNotifications: jest.fn().mockReturnValue(of(null)),
            updateStatus: jest.fn().mockReturnValue(of(null)),
        };

        TestBed.configureTestingModule({
            providers: [
                HomeComponent,
                { provide: ClientService, useValue: clientServiceMock },
            ],
        });

        jest.useFakeTimers();
        component = TestBed.inject(HomeComponent);
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize and subscribe to observables', () => {
        const getNotificationsIntervalTime = 2000;

        jest.advanceTimersByTime(getNotificationsIntervalTime);
        expect(clientServiceMock.getNotifications).toHaveBeenCalled();
        expect(clientServiceMock.getKey).toHaveBeenCalled();
        expect(component.key).toBe('test-key');
    });

    it('should call GetFile and set file content', () => {
        const notification: NotificationModel = {
            fileId: '1',
            applicationName: 'app',
            fileVersion: 'v1',
            dataUrl: 'url',
        } as NotificationModel;
        component.GetFile(notification);
        expect(clientServiceMock.GetFile).toHaveBeenCalledWith(
            notification,
            'test-key',
            false,
        );
    });

    it('should save key', () => {
        component.saveKey();
        expect(clientServiceMock.saveKey).toHaveBeenCalledWith('test-key');
    });

    it('should clear notifications', () => {
        component.clearNotifications();
        expect(clientServiceMock.clearNotifications).toHaveBeenCalled();
    });

    it('should open and close notification dialog', () => {
        component.openNotificationDialog();
        expect(component.showDialog()).toBe(true);
        component.closeNotificationDialog();
        expect(component.showDialog()).toBe(false);
    });

    it('should handle dialog submit', () => {
        const event = {
            processedStatus: ProcessedStatus.Succeeded,
            comments: 'test',
        };
        const notification: NotificationModel = {
            fileId: '1',
            applicationName: 'app',
            fileVersion: 'v1',
            dataUrl: 'url',
        } as NotificationModel;
        component.handleDialogSubmit(event, notification);
        expect(clientServiceMock.updateStatus).toHaveBeenCalled();
        expect(component.showDialog()).toBe(false);
    });

    it('should correctly identify JSON strings', () => {
        expect(component['IsJson']('{"key": "value"}')).toBe(true);
        expect(component['IsJson']('not a json')).toBe(false);
    });
});
