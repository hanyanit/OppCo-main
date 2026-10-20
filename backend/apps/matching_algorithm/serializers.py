from rest_framework import serializers

class OpportunitySerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    provider = serializers.CharField()
    location = serializers.CharField()
    category = serializers.CharField()  
    description = serializers.CharField()
    benefits = serializers.ListField(child=serializers.CharField())
    closing_date = serializers.DateField()

    start_date = serializers.DateField(allow_null=True)
    end_date = serializers.DateField(allow_null=True)
    duration_weeks = serializers.IntegerField(allow_null=True)

    logo_url = serializers.CharField(allow_null=True, required=False)
    application_link = serializers.CharField(allow_null=True, required=False)

    required_nationality = serializers.ListField(child=serializers.CharField(), allow_null=True)
    required_race = serializers.ListField(child=serializers.CharField(), allow_null=True)
    required_gender = serializers.CharField(allow_null=True)
    min_age = serializers.IntegerField(allow_null=True)
    max_age = serializers.IntegerField(allow_null=True)
    min_average = serializers.FloatField(allow_null=True)
    required_subjects = serializers.ListField(child=serializers.CharField(), allow_null=True)
    education_levels = serializers.ListField(child=serializers.CharField(), allow_null=True)
    undergraduate_levels = serializers.ListField(child=serializers.CharField(), allow_null=True)
    postgraduate_levels = serializers.ListField(child=serializers.CharField(), allow_null=True)
    tertiary_types = serializers.ListField(child=serializers.CharField(), allow_null=True)
    institution_types = serializers.ListField(child=serializers.CharField(), allow_null=True)
    institution_names = serializers.ListField(child=serializers.CharField(), allow_null=True)
    income_threshold = serializers.FloatField(allow_null=True)