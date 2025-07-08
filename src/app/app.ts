import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { debounceTime } from 'rxjs';

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
    CurrencyPipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  itemsForm = new FormArray([this.itemGroup]);
  total = 0;

  ngOnInit(): void {
    console.log(this.itemsForm);

    this.itemsForm.valueChanges.pipe(debounceTime(250)).subscribe({
      next: (value) => {
        console.log(value);
        console.log(this.itemsForm);
        this.itemsForm.controls.forEach((control) => {
          if (control.get('amount')!.valid && control.get('price')!.valid) {
            control
              .get('total')!
              .setValue(
                control.get('amount')!.value! * control.get('price')!.value!,
                { emitEvent: false }
              );
          }
        });

        this.total = this.itemsForm.controls.reduce(
          (acc, cur) => acc + cur.get('total')!.value!,
          0
        );
      },
    });
  }

  private get itemGroup() {
    return new FormGroup({
      name: new FormControl<string | null>(null, Validators.required),
      amount: new FormControl<number | null>(null, Validators.required),
      price: new FormControl<number | null>(null, Validators.required),
      total: new FormControl<number | null>(null),
    });
  }

  clearList(): void {
    this.itemsForm = new FormArray([this.itemGroup]);
  }

  addItem(): void {
    this.itemsForm.push(this.itemGroup);
  }
}
