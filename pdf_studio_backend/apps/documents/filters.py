import django_filters
from .models import Document


class DocumentFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Document.Status.choices)
    is_public = django_filters.BooleanFilter()
    created_after = django_filters.DateTimeFilter(
        field_name="created_at",
        lookup_expr="gte",
    )
    created_before = django_filters.DateTimeFilter(
        field_name="created_at",
        lookup_expr="lte",
    )
    min_size = django_filters.NumberFilter(field_name="file_size", lookup_expr="gte")
    max_size = django_filters.NumberFilter(field_name="file_size", lookup_expr="lte")

    class Meta:
        model = Document
        fields = ["status", "is_public"]
