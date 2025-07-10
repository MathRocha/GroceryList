import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { debounceTime } from 'rxjs';
import { ConfirmationDialog } from './confirmation-dialog/confirmation-dialog';
import { ItemForm } from '../interfaces/item';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    DecimalPipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  itemsForm = new FormGroup({
    items: new FormArray([this.itemGroup]),
    total: new FormControl<number>(0),
  });
  lightMode = document.body.classList.contains('lightmode');
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.retrieveData();

    this.itemsForm.valueChanges.pipe(debounceTime(250)).subscribe({
      next: () => {
        this.itemsArray.controls.forEach((control) => {
          if (control.get('amount')!.valid && control.get('price')!.valid) {
            control
              .get('total')!
              .setValue(
                control.get('amount')!.value! * control.get('price')!.value!,
                { emitEvent: false }
              );
          }
        });

        this.itemsForm.get('total')?.setValue(
          this.itemsArray.controls.reduce(
            (acc, cur) => acc + cur.get('total')!.value!,
            0
          ),
          { emitEvent: false }
        );

        this.storeData();
      },
    });
  }

  get itemsArray() {
    return this.itemsForm.get('items') as FormArray<
      FormGroup<{
        name: FormControl<string | null>;
        amount: FormControl<number | null>;
        price: FormControl<number | null>;
        total: FormControl<number | null>;
      }>
    >;
  }

  private get itemGroup() {
    return new FormGroup({
      name: new FormControl<string | null>(null, Validators.required),
      amount: new FormControl<number | null>(null, Validators.required),
      price: new FormControl<number | null>(null, Validators.required),
      total: new FormControl<number | null>(0),
    });
  }

  clearList(): void {
    this.dialog
      .open(ConfirmationDialog)
      .afterClosed()
      .subscribe({
        next: (response: boolean) => {
          if (response) {
            this.itemsArray.clear();
            this.itemsForm.get('total')?.setValue(0);
            this.addItem();
          }
        },
      });
  }

  addItem(): void {
    this.itemsArray.push(this.itemGroup);
  }

  toggleMode() {
    this.lightMode = !this.lightMode;
    if (this.lightMode) {
      document.body.classList.add('lightmode');
      localStorage.setItem('lightmode', 'true');
    } else {
      document.body.classList.remove('lightmode');
      localStorage.removeItem('lightmode');
    }
  }

  private storeData(): void {
    localStorage.setItem('formData', JSON.stringify(this.itemsForm.value));
  }

  private retrieveData() {
    const data: ItemForm = JSON.parse(
      localStorage.getItem('formData') || 'false'
    );
    if (data) {
      if (data.items.length > 1) {
        // Add extra groups inside the form array so values can be setted
        for (let i = 1; i < data.items.length; i++) {
          this.itemsArray.push(this.itemGroup);
        }
      }
      this.itemsForm.setValue(data, { emitEvent: false });
    }
  }
}
