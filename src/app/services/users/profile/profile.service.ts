import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

// Initialize Supabase client
const supabase = createClient(
  environment.supabaseUrl,
  environment.supabaseAnonKey
);

@Injectable({ providedIn: 'root' })
export class ProfileService {
  async getProfile() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) throw new Error('User not found');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId) // Matching by user_id
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(profile: {
    full_name: string;
    phone_number: string;
    bio: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  }) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) throw new Error('User not found');

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: userId,
          ...profile,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'user_id'
        }
      );

    if (error) throw error;
    return true;
  }
}