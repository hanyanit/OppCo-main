// src/app/services/bookmarks/bookmarks.service.ts
import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  private supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

  async getBookmarks(userId: string) {
    const { data, error } = await this.supabase
      .from('bookmarks')
      .select('bursary_id')
      .eq('user_id', userId);
    if (error) throw error;
    return data.map((item: any) => item.bursary_id);
  }

  async bookmarkBursary(userId: string, bursaryId: string) {
    const { error } = await this.supabase.from('bookmarks').insert([{ user_id: userId, bursary_id: bursaryId }]);
    if (error) throw error;
  }

  async removeBookmark(userId: string, bursaryId: string) {
    const { error } = await this.supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('bursary_id', bursaryId);
    if (error) throw error;
  }
}
