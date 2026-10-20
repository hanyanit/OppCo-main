import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PersonalInfoService } from '../../../services/users/personal-info/personal-info.service';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit {
  form: FormGroup;
  loading = false;

  nationalities = ["Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguans", "Argentine", "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Barbudans", "Batswana", "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish", "Djiboutian", "Dominican", "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirian", "Equatorial Guinean", "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinea-Bissauan", "Guinean", "Guyanese", "Haitian", "Herzegovinian", "Honduran", "Hungarian", "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kittian and Nevisian", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourger", "Macedonian", "Malagasy", "Malawian", "Malaysian", "Maldivian", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", "Moldovan", "Monacan", "Mongolian", "Moroccan", "Mosotho", "Motswana", "Mozambican", "Namibian", "Nauruan", "Nepalese", "New Zealander", "Nicaraguan", "Nigerian", "Nigerien", "North Korean", "Northern Irish", "Norwegian", "Omani", "Pakistani", "Palauan", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Lucian", "Salvadoran", "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Scottish", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean", "Singaporean", "Slovakian", "Slovenian", "Solomon Islander", "Somali", "South African", "South Korean", "Spanish", "Sri Lankan", "Sudanese", "Surinamer", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", "Trinidadian or Tobagonian", "Tunisian", "Turkish", "Tuvaluan", "Ugandan", "Ukrainian", "Uruguayan", "Uzbekistani", "Venezuelan", "Vietnamese", "Welsh", "Yemenite", "Zambian", "Zimbabwean"];
  races = ['Black', 'White', 'Coloured', 'Indian' ];
  genders = ['Male', 'Female'];
  countries = ['South Africa'];
  provinces = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"];
  disabilityOptions = ['Yes', 'No'];

  constructor(private fb: FormBuilder, private personalService: PersonalInfoService) {
    this.form = this.fb.group({
      dob: [''],
      age: [{ value: '', disabled: true }],
      nationality: [''],
      race: [''],
      gender: [''],
      country: [''],
      province: [''],
      district: [''],
      city: [''],
      municipality: [''],
      disability: [''],
    });

    this.form.get('dob')?.valueChanges.subscribe(date => {
      const age = this.calculateAge(date);
      this.form.get('age')?.setValue(age);
    });
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      this.loading = true;
      const data = await this.personalService.getPersonalInfo();
      if (data) {
        this.form.patchValue(data);
        if (data.dob) {
          this.form.get('age')?.setValue(this.calculateAge(data.dob));
        }
      }
    } catch (err) {
      console.error('Failed to load personal info:', err);
    } finally {
      this.loading = false;
    }
  }

  calculateAge(dob: string): number | '' {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.loading = true;
        const raw = this.form.getRawValue();
        const payload = {
          ...raw,
          age: this.calculateAge(raw.dob)
        };
        await this.personalService.updatePersonalInfo(payload);
        alert('Personal information saved successfully!');
      } catch (err) {
        console.error('Failed to save personal info:', err);
        alert('Something went wrong. Try again.');
      } finally {
        this.loading = false;
      }
    } else {
      this.form.markAllAsTouched();
      alert('Please fill in all required fields correctly.');
    }
  }

  // Optional getters for clean template bindings
  get dob() { return this.form.get('dob') as FormControl; }
  get age() { return this.form.get('age') as FormControl; }
  get nationality() { return this.form.get('nationality') as FormControl; }
  get race() { return this.form.get('race') as FormControl; }
  get gender() { return this.form.get('gender') as FormControl; }
  get country() { return this.form.get('country') as FormControl; }
  get province() { return this.form.get('province') as FormControl; }
  get district() { return this.form.get('district') as FormControl; }
  get city() { return this.form.get('city') as FormControl; }
  get municipality() { return this.form.get('municipality') as FormControl; }
  get disability() { return this.form.get('disability') as FormControl; }
}
