import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { FooterComponent } from '../../layout/footer/footer.component';

const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Redirect if already logged in
    if (typeof window !== 'undefined' && localStorage.getItem('access_token')) {
     this.router.navigate(['/my-profile']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    const { email, password } = this.form.value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      this.errorMessage = error.message; // Show real message from Supabase
      console.error('Login failed:', error);
    } else if (data.session) {
      localStorage.setItem('access_token', data.session.access_token);
      this.router.navigate(['/my-profile']);
    }
  }
}