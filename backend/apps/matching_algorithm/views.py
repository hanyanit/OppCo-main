import traceback
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from matching_algorithm.supabase_client import supabase
from .serializers import OpportunitySerializer


def has_word_overlap(user_value, required_value):
    """Returns True if any word in user_value appears in required_value."""
    if not user_value or not required_value:
        return False
    if isinstance(required_value, str):
        required_values = [required_value]
    else:
        required_values = [str(v) for v in required_value if isinstance(v, str)]

    user_words = set(user_value.lower().strip().split())
    for req in required_values:
        req_words = set(req.lower().strip().split())
        if user_words & req_words:  # intersection not empty
            return True
    return False


def user_eligible_for_opportunity(user_info, opportunity):
    personal = user_info.get('personal', {})
    academic = user_info.get('academic', {})
    financial = user_info.get('financial', {})

    # ✅ NEW: If no profile data at all, return True
    if not any([personal, academic, financial]) or (
        all(not v for v in personal.values()) and
        all(not v for v in academic.values()) and
        all(not v for v in financial.values())
    ):
        return True

    # Age check
    user_age = personal.get('age')
    if user_age is not None:
        if opportunity.get('min_age') is not None and user_age < opportunity['min_age']:
            return False
        if opportunity.get('max_age') is not None and user_age > opportunity['max_age']:
            return False

    # Race check
    if opportunity.get('required_race'):
        required_races = opportunity['required_race']
        user_race = (personal.get('race') or '').lower().strip()
        if isinstance(required_races, list):
            if user_race not in [r.lower().strip() for r in required_races if isinstance(r, str)]:
                return False
        elif isinstance(required_races, str):
            if user_race != required_races.lower().strip():
                return False

    # Gender check
    if opportunity.get('required_gender'):
        required_genders = opportunity['required_gender']
        user_gender = (personal.get('gender') or '').lower().strip()
        if isinstance(required_genders, list):
            if user_gender not in [g.lower().strip() for g in required_genders if isinstance(g, str)]:
                return False
        elif isinstance(required_genders, str):
            if user_gender != required_genders.lower().strip():
                return False
            
    # Nationality check
    if opportunity.get('required_nationality'):
        required_nationalities = opportunity['required_nationality']
        user_nationality = (personal.get('nationality') or '').lower().strip()
        if isinstance(required_nationalities, list):
            if user_nationality not in [n.lower().strip() for n in required_nationalities if isinstance(n, str)]:
                return False
        elif isinstance(required_nationalities, str):
            if user_nationality != required_nationalities.lower().strip():
                return False

    # Disability status check
    opportunity_disability = opportunity.get('disability_status')
    user_disability = (personal.get('disability') or '').lower().strip()
    if opportunity_disability is not None and isinstance(opportunity_disability, bool):
        user_has_disability = user_disability == 'yes'
        if (opportunity_disability and not user_has_disability) or (not opportunity_disability and user_has_disability):
            return False

    # Orphan status check
    opportunity_orphan = opportunity.get('orphan_status')
    user_orphan = (financial.get('orphan') or '').lower().strip()
    if opportunity_orphan is not None:
        if isinstance(opportunity_orphan, bool):
            if (opportunity_orphan and user_orphan != 'yes') or (not opportunity_orphan and user_orphan == 'yes'):
                return False

    # Academic average check
    if opportunity.get('min_average') is not None:
        subjects = academic.get('subjects', [])
        if not subjects:
            return False
        marks = [subject.get('mark', 0) for subject in subjects if 'mark' in subject]
        if not marks:
            return False
        avg_mark = sum(marks) / len(marks)
        if avg_mark < float(opportunity['min_average']):
            return False

    # Education level check
    if opportunity.get('education_levels'):
        required_levels = opportunity['education_levels']
        user_level = (academic.get('education_level') or '').lower().strip()
        if isinstance(required_levels, list):
            if user_level not in [level.lower().strip() for level in required_levels if isinstance(level, str)]:
                return False
        elif isinstance(required_levels, str):
            if user_level != required_levels.lower().strip():
                return False

     # ✅ Study year check
    if opportunity.get('study_year'):
        required_years = opportunity['study_year']
        user_year = (academic.get('study_year') or '').lower().strip()

        if isinstance(required_years, list):
            required_years = [y.lower().strip() for y in required_years if isinstance(y, str)]
            if user_year not in required_years:
                return False
        elif isinstance(required_years, str):
            if user_year != required_years.lower().strip():
                return False

    # Tertiary type check
    opportunity_tertiary_type = opportunity.get('tertiary_types')
    user_tertiary_type = (academic.get('tertiary_type') or '').lower().strip()
    if opportunity_tertiary_type:
        if isinstance(opportunity_tertiary_type, list):
            types = [t.lower().strip() for t in opportunity_tertiary_type if isinstance(t, str)]
            if user_tertiary_type not in types:
                return False
        elif isinstance(opportunity_tertiary_type, str):
            if user_tertiary_type != opportunity_tertiary_type.lower().strip():
                return False

    # Institution type check
    if opportunity.get('institution_type'):
        required_types = opportunity['institution_type']
        user_type = (academic.get('institution_type') or '').lower().strip()
        if isinstance(required_types, list):
            if user_type not in [t.lower().strip() for t in required_types if isinstance(t, str)]:
                return False
        elif isinstance(required_types, str):
            if user_type != required_types.lower().strip():
                return False

    # Institution name check
    if opportunity.get('institution_name'):
        required_names = opportunity['institution_name']
        user_institution = (academic.get('institution_name') or '').lower().strip()
        if isinstance(required_names, list):
            required_names = [name.lower().strip() for name in required_names if isinstance(name, str)]
            if user_institution not in required_names:
                return False
        elif isinstance(required_names, str):
            if user_institution != required_names.lower().strip():
                return False

    # Field of study check
    required_fields = opportunity.get('fields_of_study')
    if isinstance(required_fields, str):
        try:
            required_fields = json.loads(required_fields)
        except json.JSONDecodeError:
            required_fields = [required_fields]

    qualification = academic.get('qualification', '')
    if required_fields and qualification:
        qualification_lower = qualification.lower().strip()
        found_match = False
        for field in required_fields:
            if not isinstance(field, str):
                continue
            field_lower = field.lower().strip()
            if not field_lower:
                continue
            if field_lower in qualification_lower or qualification_lower in field_lower:
                found_match = True
                break
        if not found_match:
            return False

    # Income threshold check
    if opportunity.get('income_threshold') is not None:
        try:
            threshold = float(opportunity['income_threshold'])
            user_income = float(financial.get('max_household_income', 0))
            if user_income > threshold:
                return False
        except (ValueError, TypeError):
            return False

    # Country exact match
    if opportunity.get('country'):
        required_countries = opportunity['country']
        user_country = (personal.get('country') or '').lower().strip()
        if isinstance(required_countries, list):
            if user_country not in [c.lower().strip() for c in required_countries if isinstance(c, str)]:
                return False
        elif isinstance(required_countries, str):
            if user_country != required_countries.lower().strip():
                return False

    # Province exact match
    if opportunity.get('province'):
        required_provinces = opportunity['province']
        user_province = (personal.get('province') or '').lower().strip()
        if isinstance(required_provinces, list):
            if user_province not in [p.lower().strip() for p in required_provinces if isinstance(p, str)]:
                return False
        elif isinstance(required_provinces, str):
            if user_province != required_provinces.lower().strip():
                return False

    # District match (word overlap)
    if opportunity.get('district'):
        if not has_word_overlap(personal.get('district', ''), opportunity['district']):
            return False

    # City/Town/Township/Village match (word overlap)
    if opportunity.get('city_town_township_village'):
        if not has_word_overlap(personal.get('city', ''), opportunity['city_town_township_village']):
            return False

    # Municipality match (word overlap)
    if opportunity.get('municipality'):
        if not has_word_overlap(personal.get('municipality', ''), opportunity['municipality']):
            return False

    return True


@api_view(['GET'])
def eligible_opportunities(request):
    user_id = request.query_params.get('user_id')
    if not user_id:
        return Response({'error': 'user_id is required'}, status=400)

    try:
        personal_res = supabase.table('personal_info').select('*').eq('user_id', user_id).execute()
        academic_res = supabase.table('academic_info').select('*').eq('user_id', user_id).execute()
        financial_res = supabase.table('financial_info').select('*').eq('user_id', user_id).execute()

        if personal_res.data is None or not isinstance(personal_res.data, list):
            return Response({'error': 'Error fetching personal info'}, status=500)
        if academic_res.data is None or not isinstance(academic_res.data, list):
            return Response({'error': 'Error fetching academic info'}, status=500)

        personal_info = personal_res.data[0] if personal_res.data else {}
        academic_info = academic_res.data[0] if academic_res.data else {}
        financial_info = financial_res.data[0] if financial_res.data else {}

        user_info = {
            'personal': personal_info,
            'academic': academic_info,
            'financial': financial_info
        }

        opportunities_res = supabase.table('opportunities').select('*').eq('is_active', True).execute()
        if opportunities_res.data is None or not isinstance(opportunities_res.data, list):
            return Response({'error': 'Error fetching opportunities'}, status=500)

        opportunities = opportunities_res.data
        eligible = [o for o in opportunities if user_eligible_for_opportunity(user_info, o)]

        serializer = OpportunitySerializer(eligible, many=True)
        return Response(serializer.data)

    except Exception as e:
        tb = traceback.format_exc()
        return Response({'error': f'Internal server error: {str(e)}', 'traceback': tb}, status=500)