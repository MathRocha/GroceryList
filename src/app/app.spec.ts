import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { App } from './app';
import { of } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /** Form Array was persisting data across tests, this function is used to guarantee that the array is clear */
  function clearFormArray() {
    component.itemsArray.clear();
    component.addItem();
  }

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Grocery List');
  });

  it('should toggle light mode', () => {
    const lightmode = component.lightMode;
    component.toggleMode();
    fixture.detectChanges();
    expect(component.lightMode).not.toBe(lightmode);
  });

  it('total should be price times amount', fakeAsync(() => {
    const amount = 10;
    const price = 9.99;
    clearFormArray();
    component.itemsArray.at(0).get('amount')!.setValue(amount);
    component.itemsArray.at(0).get('price')!.setValue(price);
    const compiled = fixture.nativeElement.querySelector(
      'input'
    ) as HTMLElement;
    compiled.dispatchEvent(new Event('input[formControlName="amount"]'));
    tick(300);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.itemsArray.at(0).get('total')!.value).toBe(
        amount * price
      );
    });
  }));

  it('should sum every total of the list', fakeAsync(() => {
    clearFormArray();
    const amount = [10, 3, 7, 5.5, 2];
    const price = [9.99, 13.5, 23.75, 42, 6.53];
    let total = 0;
    for (let index = 0; index < 5; index++) {
      if (index > 0) {
        component.addItem();
      }
      component.itemsArray.at(index).get('amount')!.setValue(amount[index]);
      component.itemsArray.at(index).get('price')!.setValue(price[index]);
      total += amount[index] * price[index];
    }
    expect(component.itemsArray.length).toBe(5);
    const compiled = fixture.nativeElement.querySelector(
      'input'
    ) as HTMLElement;
    compiled.dispatchEvent(new Event('input[formControlName="amount"]'));
    tick(300);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.itemsForm.get('total')!.value).toBe(total);
    });
  }));

  it('should clear the list', () => {
    clearFormArray();
    // Add 2 new items (for a total of 3 items)
    component.addItem();
    component.addItem();
    expect(component.itemsArray.length).toBe(3);

    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(true),
    } as MatDialogRef<typeof component>);
    component.clearList();
    fixture.detectChanges();
    expect(component.itemsArray.length).toBe(1);
  });

  it('should NOT clear the list', () => {
    clearFormArray();
    // Add 2 new items (for a total of 3 items)
    component.addItem();
    component.addItem();
    expect(component.itemsArray.length).toBe(3);

    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(false),
    } as MatDialogRef<typeof component>);
    component.clearList();
    fixture.detectChanges();
    expect(component.itemsArray.length).toBe(3);
  });

  it('should add an item to the list', () => {
    clearFormArray();
    expect(component.itemsArray.length).toBe(1);
    component.addItem();
    expect(component.itemsArray.length).toBe(2);
  });
});
