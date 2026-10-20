import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const feedback = this.form.value;

      this.http.post('http://127.0.0.1:8000/api/feedback/', feedback).subscribe({
        next: () => {
          alert('Thank you! Your feedback has been sent directly to the founders.');
          this.form.reset();
        },
        error: (err) => {
          console.error('Failed to send feedback:', err);
          alert('Something went wrong. Please try again later.');
        }
      });
    } else {
      alert('Please complete the form before submitting.');
    }
  }
}