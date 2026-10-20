import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { FooterComponent } from '../../layout/footer/footer.component';

const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FooterComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Supabase puts #access_token in the URL for recovery links
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', '?'));
    const type = params.get('type');

    if (type !== 'recovery') {
      this.errorMessage = 'Invalid or expired reset link. Please request a new one.';
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    const { password } = this.form.value;

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      this.errorMessage = error.message;
    } else {
      this.successMessage = 'Password updated successfully. Redirecting...';
      setTimeout(() => this.router.navigate(['/login']), 2500);
    }
  }
}
