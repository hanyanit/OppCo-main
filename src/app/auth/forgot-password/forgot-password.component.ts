import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { FooterComponent } from '../../layout/footer/footer.component';

const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FooterComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please enter a valid email address.';
      this.successMessage = null;
      return;
    }

    const { email } = this.form.value;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://oppco.co.za/reset-password' // must be in Supabase Auth Redirect URLs
    });

    if (error) {
      this.errorMessage = error.message;
      this.successMessage = null;
    } else {
      this.errorMessage = null;
      this.successMessage = 'Check your email for a password reset link.';
    }
  }
}
