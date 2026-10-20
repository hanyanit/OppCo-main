import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

// Initialize Supabase client
const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

export interface PersonalInfo {
  dob: string;
  age?: number;
  nationality: string;
  race: string;
  gender: string;
  country: string;
  province: string;
  district: string;
  city: string;
  municipality: string;
  disability: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class PersonalInfoService {
  async getPersonalInfo() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) throw new Error('User not found');

    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as PersonalInfo;
  }

  async updatePersonalInfo(personal_info: PersonalInfo) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) throw new Error('User not found');

    const { error } = await supabase
      .from('personal_info')
      .upsert(
        {
          user_id: userId,
          ...personal_info,
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
