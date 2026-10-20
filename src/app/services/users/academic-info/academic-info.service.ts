import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

export interface AcademicInfo {
  grade?: string;
  tertiary_type?: string;
  education_level: string;
  undergraduate_level?: string;
  postgraduate_level?: string;
  study_year?: string;
  qualification?: string;
  institution_type?: string;
  institution_name?: string;

  term_or_semester?: string;
  subjects: { name: string; mark: number }[];
  average: number;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class AcademicInfoService {
  async getAcademicInfo() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) throw new Error('User not found');

    const { data, error } = await supabase
      .from('academic_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as AcademicInfo;
  }

  async upsertAcademicInfo(academicInfo: AcademicInfo) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) throw new Error('User not found');

    const { error } = await supabase
      .from('academic_info')
      .upsert({
        user_id: userId,
        ...academicInfo,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (error) throw error;
    return true;
  }
}
