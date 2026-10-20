import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Opportunity {
  id: string;
  title: string;
  provider: string;
  location: string;
  category: string;
  description: string;
  benefits: string[];
  closing_date: string;
  required_nationality: string[] | null;
  required_race: string[] | null;
  required_gender: string[] | null;
  min_age: number | null;
  max_age: number | null;
  min_average: string;
  required_subjects: string[] | null;
  education_levels: string[] | null;
  undergraduate_levels?: string[] | null;
  postgraduate_levels?: string[] | null;
  study_year?: string[] | null;
  tertiary_types?: string[] | null;
  institution_types: string[] | null;
  institution_names: string[] | null;
  fields_of_study: string[] | null;
  grades?: string[] | null;
  country?: string[] | null;
  province?: string[] | null;
  municipality?: string[] | null;
  district?: string[] | null;
  city_town_township_village?: string[] | null;
  disability_status?: boolean; 
  orphan_status?: boolean; 
  income_threshold: string | null;
  dependant_min: number | null;
  application_link: string; 
  logo_url: string;
  created_at?: string;
  updated_at?: string;
  start_date?: string;
  end_date?: string;
  duration_weeks?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MatchingAlgorithmService {
  private apiUrl = `${environment.apiUrl}matching-algorithm/eligible-opportunities/`;

  constructor(private http: HttpClient) {}

  getEligibleBursaries(userId: string): Observable<Opportunity[]> {
    return this.http.get<Opportunity[]>(this.apiUrl, {
      params: { user_id: userId }
    });
  }

  getOpportunityById(id: string): Observable<Opportunity> {
    return this.http.get<Opportunity>(`${this.apiUrl}${id}/`);
  }
}
