import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialog } from './confirmation-dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

describe('ConfirmationDialog', () => {
  let component: ConfirmationDialog;
  let fixture: ComponentFixture<ConfirmationDialog>;
  let dialogRef: MatDialogRef<ConfirmationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialog],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (res: any) => {},
          },
        },
        {
          provide: MatDialog,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialog);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog returning false', () => {
    const closeSpy = spyOn(dialogRef, 'close');
    const clickCloseElement: HTMLElement = fixture.nativeElement.querySelector(
      '#btnConfirmationDialogNo'
    );
    clickCloseElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(closeSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalledWith(false);
  });

  it('should close dialog returning true', () => {
    const closeSpy = spyOn(dialogRef, 'close');
    const clickCloseElement: HTMLElement = fixture.nativeElement.querySelector(
      '#btnConfirmationDialogYes'
    );
    clickCloseElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(closeSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalledWith(true);
  });
});
