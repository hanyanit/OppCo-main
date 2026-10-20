import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AcademicInfoService } from '../../../services/users/academic-info/academic-info.service';

@Component({
  selector: 'app-academic-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './academic-info.component.html',
  styleUrls: ['./academic-info.component.scss']
})
export class AcademicInfoComponent implements OnInit {
  form: FormGroup;
  average = 0;
  loading = false;

  educationLevels = ['Primary School Learner', 'High School Learner', 'Tertiary Student', 'Graduate'];
  gradesPrimary = Array.from({ length: 7 }, (_, i) => `Grade ${i + 1}`);
  gradesHigh = Array.from({ length: 5 }, (_, i) => `Grade ${i + 8}`);
  studyYears = ['1st Year', '2nd Year', '3rd Year', '4th Year, 5th Year, 6th Year'];
  semesters = ['Semester 1', 'Semester 2'];
  schoolTerms = ['Term 1', 'Term 2', 'Term 3', 'Term 4'];
  institutionTypes = ['Public', 'Private'];
  tertiaryTypes = ['Undergraduate', 'Postgraduate'];
  undergraduateLevels = ['Higher Certificate', 'Diploma', "Bachelor's Degree"];
  postgraduateLevels = ['Honours Degree', "Master's Degree", 'PhD Degree'];

  publicInstitutions = [
    "University of Cape Town", "University of the Witwatersrand", "University of Pretoria", "Stellenbosch University",
    "University of KwaZulu-Natal", "University of Johannesburg", "University of the Western Cape", "North-West University",
    "Rhodes University", "University of South Africa (UNISA)", "Nelson Mandela University", "University of Fort Hare",
    "Tshwane University of Technology", "Cape Peninsula University of Technology", "Central University of Technology",
    "Durban University of Technology", "Mangosuthu University of Technology", "Vaal University of Technology",
    "Walter Sisulu University", "University of Mpumalanga", "Sol Plaatje University", "Sefako Makgatho Health Sciences University",
    "University of Zululand", "Tshwane University of Technology", "University of Limpopo"
  ];

  privateInstitutions = [
    "Varsity College", "Monash South Africa", "Richfield", "REGENT Business School", "Eduvos",
    "Rosebank College", "Milpark Education", "CTU Training Solutions", "Vega School of Brand Leadership",
    "Management College of Southern Africa (MANCOSA)", "Stadio", "Boston City Campus & Business College"
  ];

  institutions: string[] = [];

  constructor(private fb: FormBuilder, private academicService: AcademicInfoService) {
    this.form = this.fb.group({
      education_level: [''],
      grade: [''],
      tertiary_type: [''],
      undergraduate_level: [''],
      postgraduate_level: [''],
      study_year: [''],
      qualification: [''],
      institution_type: [''],
      institution_name: [''],

      term_or_semester: [''],
      subjects: this.fb.array([])
    });

    this.form.get('education_level')!.valueChanges.subscribe(() => this.resetConditionalFields());
    this.form.get('institution_type')!.valueChanges.subscribe((type) => this.updateInstitutions(type));
    this.form.get('tertiary_type')!.valueChanges.subscribe(() => {
    this.form.get('postgraduate_level')?.reset();
    });
  }

  ngOnInit() {
    this.loadData();
  }

  get subjects() {
    return this.form.get('subjects') as FormArray;
  }

  addSubject() {
    const subjectGroup = this.fb.group({
      name: ['', Validators.required],
      mark: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    subjectGroup.get('mark')!.valueChanges.subscribe(() => this.calculateAverage());
    this.subjects.push(subjectGroup);
    this.calculateAverage();
  }

  removeSubject(index: number) {
    this.subjects.removeAt(index);
    this.calculateAverage();
  }

  calculateAverage() {
    const marks = this.subjects.controls.map(s => Number(s.get('mark')?.value)).filter(m => !isNaN(m));
    this.average = marks.length ? Math.round(marks.reduce((a, b) => a + b, 0) / marks.length) : 0;
  }

  updateInstitutions(type: string) {
    if (type === 'Public') {
      this.institutions = this.publicInstitutions;
    } else if (type === 'Private') {
      this.institutions = this.privateInstitutions;
    } else {
      this.institutions = [];
    }
    this.form.get('institution_name')?.reset();
  }

  resetConditionalFields() {
    this.subjects.clear();
    this.average = 0;
    this.form.patchValue({
      grade: '',
      tertiary_type: '',
      undergraduate_level: '',
      postgraduate_level: '',
      study_year: '',
      qualification: '',
      institution_type: '',
      institution_name: '',
      term_or_semester: ''
    });

  }

  async loadData() {
    try {
      this.loading = true;
      const data = await this.academicService.getAcademicInfo();
      if (data) {
        // First, update institutions so options are ready
        if (data.institution_type) {
          this.updateInstitutions(data.institution_type);
        }
        // Then patch the form so institution_name matches an existing option
        this.form.patchValue(data);

        // patch subjects array as before
        if (data.subjects) {
          this.subjects.clear();
          data.subjects.forEach(subj =>
            this.subjects.push(this.fb.group({
              name: [subj.name, Validators.required],
              mark: [subj.mark, [Validators.required, Validators.min(0), Validators.max(100)]]
            }))
          );
          this.calculateAverage();
        }
      }
    } catch (err) {
      console.error('Failed to load academic info:', err);
    } finally {
      this.loading = false;
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        const formData = { ...this.form.value };

        // Fix for Postgres array literal error:
        // Wrap string values into arrays if your backend expects arrays for these fields
        if (formData.undergraduate_level && typeof formData.undergraduate_level === 'string') {
          formData.undergraduate_level = [formData.undergraduate_level];
        }
        if (formData.postgraduate_level && typeof formData.postgraduate_level === 'string') {
          formData.postgraduate_level = [formData.postgraduate_level];
        }

        console.log('Submitting data:', formData);
        await this.academicService.upsertAcademicInfo(formData);
        alert('Academic information saved successfully!');
      } catch (err: any) {
        console.error('Error saving academic info:', err);
        alert('Something went wrong: ' + (err.message || err));
      }
    } else {
      this.form.markAllAsTouched();
      alert('Please fill in all required fields.');
    }
  }
}
