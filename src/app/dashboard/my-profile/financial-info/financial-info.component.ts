import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FinancialInfoService } from '../../../services/users/financial-info/financial-info.service';

@Component({
  selector: 'app-financial-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './financial-info.component.html',
  styleUrls: ['./financial-info.component.scss']
})
export class FinancialInfoComponent implements OnInit {
  form: FormGroup;
  yesNo = ['Yes', 'No'];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialInfoService
  ) {
    this.form = this.fb.group({
      max_household_income: ['', Validators.min(0)],
      orphan_status: [''],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      this.loading = true; 
      const data = await this.financialService.getFinancialInfo();
      if (data) {
        this.form.patchValue(data);
      }
    } catch (err) {
      console.error('Failed to load financial info:', err);
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.loading = true;
        await this.financialService.upsertFinancialInfo(this.form.value);
        alert('Financial information saved successfully!');
      } catch (err) {
        console.error('Upsert failed:', err);
        alert('Something went wrong. Please try again.');
      } finally {
        this.loading = false;
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
