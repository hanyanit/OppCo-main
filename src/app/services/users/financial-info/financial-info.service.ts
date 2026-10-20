import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

// Initialize Supabase client
const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

export interface FinancialInfo {
  max_household_income: number;
  orphan_status: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class FinancialInfoService {
  async getFinancialInfo() {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) throw new Error('User not found');

    const { data, error } = await supabase
      .from('financial_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as FinancialInfo;
  }

  async upsertFinancialInfo(financial_info: FinancialInfo) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) throw new Error('User not found');

    const { error } = await supabase
      .from('financial_info')
      .upsert(
        {
          user_id: userId,
          ...financial_info,
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
