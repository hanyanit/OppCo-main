import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { FooterComponent } from '../../layout/footer/footer.component';

const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FooterComponent],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  form: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
        ]
      ],
      acceptTerms: [false, Validators.requiredTrue], // ✅ checkbox validation
    });

    // Redirect if already logged in
    if (typeof window !== 'undefined' && localStorage.getItem('access_token')) {
      this.router.navigate(['/my-profile']);
    }
  }

  async onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.form.invalid) {
      this.errorMessage =
        'Please complete all required fields, use a valid password, and accept the terms.';
      return;
    }

    const { email, password } = this.form.value;

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        this.errorMessage = `Signup failed: ${error.message}`;
        console.error('Signup error:', error.message);
        return;
      }

      if (data.user) {
        this.successMessage = 'Signup successful. Please check your email to confirm your account.';

        // Optional: sync with Django backend
        await fetch(`${environment.apiUrl}auth/sync/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.user.email,
            supabase_uid: data.user.id,
          }),
        });

        // Redirect after short delay
        setTimeout(() => this.router.navigate(['/login']), 3000);
      }
    } catch (err) {
      this.errorMessage = 'Unexpected signup failure. Please try again.';
      console.error('Unexpected signup failure:', err);
    }
  }
}
