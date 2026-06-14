import factory
from django.contrib.auth import get_user_model
from apps.documents.models import Document, Page, DocumentVersion

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")
    password = factory.PostGenerationMethodCall("set_password", "testpass123")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")


class DocumentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Document

    owner = factory.SubFactory(UserFactory)
    title = factory.Faker("sentence", nb_words=4)
    description = factory.Faker("paragraph")
    status = Document.Status.DRAFT
    file_size = factory.Faker("random_int", min=1024, max=10485760)
    page_count = factory.Faker("random_int", min=1, max=50)
    is_public = False


class PageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Page

    document = factory.SubFactory(DocumentFactory)
    page_number = factory.Sequence(lambda n: n + 1)
    width = 2480
    height = 3508
    ocr_text = factory.Faker("paragraph")


class DocumentVersionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = DocumentVersion

    document = factory.SubFactory(DocumentFactory)
    version_number = factory.Sequence(lambda n: n + 1)
    file_size = factory.Faker("random_int", min=1024, max=10485760)
    changes_summary = factory.Faker("sentence")
    created_by = factory.SubFactory(UserFactory)
