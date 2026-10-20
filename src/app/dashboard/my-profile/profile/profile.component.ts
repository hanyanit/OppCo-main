import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { ProfileService } from '../../../services/users/profile/profile.service';
import { AcademicInfoComponent } from "../academic-info/academic-info.component";
import { PersonalInfoComponent } from "../personal-info/personal-info.component";
import { FinancialInfoComponent } from "../financial-info/financial-info.component";

// Create Supabase client
const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AcademicInfoComponent, PersonalInfoComponent, FinancialInfoComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class MyProfileComponent {
  profileForm: FormGroup;
  loading = true; // <-- Add loading state
  private platformId: Object;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;

    this.profileForm = this.fb.group({
      fullName: new FormControl(''),
      email: new FormControl({ value: '', disabled: true }), // display only
      phone: new FormControl(''),
      role: new FormControl(''), // Optional, display only for now
      bio: new FormControl(''),
      linkedin: new FormControl(''),
      instagram: new FormControl(''),
      facebook: new FormControl(''),
      twitter: new FormControl(''),
    });

    if (isPlatformBrowser(this.platformId)) {
      this.loadProfile();
    }
  }

  async loadProfile() {
    this.loading = true; // Start loading
    try {
      // 1. Get Supabase auth user
      const { data: authUser } = await supabase.auth.getUser();
      const email = authUser?.user?.email;

      // 2. Get profile from Supabase DB
      const profile = await this.profileService.getProfile();

      // 3. Patch values into the form
      this.profileForm.patchValue({
        fullName: profile.full_name || '',
        email: email || '',
        phone: profile.phone_number || '',
        bio: profile.bio || '',
        linkedin: profile.linkedin || '',
        instagram: profile.instagram || '',
        facebook: profile.facebook || '',
        twitter: profile.twitter || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Optionally show user-friendly message here
    } finally {
      this.loading = false; // Stop loading after done or error
    }
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.valid) {
      try {
        await this.profileService.updateProfile({
          full_name: this.profileForm.value.fullName,
          phone_number: this.profileForm.value.phone,
          bio: this.profileForm.value.bio,
          linkedin: this.profileForm.value.linkedin,
          instagram: this.profileForm.value.instagram,
          facebook: this.profileForm.value.facebook,
          twitter: this.profileForm.value.twitter,
        });
        alert('Profile updated successfully!');
      } catch (error: any) {
        alert('Failed to update profile: ' + (error.message || error));
      }
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }

  // Getter methods (unchanged)...
  get fullNameControl(): FormControl { return this.profileForm.get('fullName') as FormControl; }
  get emailControl(): FormControl { return this.profileForm.get('email') as FormControl; }
  get phoneControl(): FormControl { return this.profileForm.get('phone') as FormControl; }
  get roleControl(): FormControl { return this.profileForm.get('role') as FormControl; }
  get bioControl(): FormControl { return this.profileForm.get('bio') as FormControl; }
  get linkedinControl(): FormControl { return this.profileForm.get('linkedin') as FormControl; }
  get instagramControl(): FormControl { return this.profileForm.get('instagram') as FormControl; }
  get facebookControl(): FormControl { return this.profileForm.get('facebook') as FormControl; }
  get twitterControl(): FormControl { return this.profileForm.get('twitter') as FormControl; }
}
