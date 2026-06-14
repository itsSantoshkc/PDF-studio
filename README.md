# PDF Studio

A full-stack PDF processing and management platform built with Django REST Framework and React.

## Features

- **User Authentication** - JWT-based auth with registration, login, and profile management
- **Document Management** - Upload, organize, and manage PDF documents
- **PDF Viewer** - View PDFs with zoom controls and page navigation
- **PDF Editor** - Edit pages with drag-and-drop reordering
- **Image Processing** - Enhance, denoise, binarize, and deskew images
- **OCR Support** - Extract text from images using Tesseract or EasyOCR
- **Document Merging** - Combine multiple PDFs into one
- **Cloud Storage** - Support for local and S3 storage backends
- **Rate Limiting** - Redis-based sliding window rate limiting
- **Task Queue** - Async processing with Celery

## Tech Stack

### Backend
- Django 4.2+
- Django REST Framework
- Celery + Redis
- PostgreSQL
- pypdf / pikepdf
- Pillow / OpenCV / scikit-image
- Tesseract / EasyOCR

### Frontend
- React 18
- TanStack Router
- Zustand (State Management)
- Tailwind CSS + shadcn/ui
- PDF.js
- DnD Kit (Drag & Drop)
- Axios
- Vite

## Project Structure

```
Pdf Studio/
├── pdf_studio_backend/     # Django backend
│   ├── apps/               # Django apps
│   │   ├── authentication/ # User auth & JWT
│   │   ├── documents/      # Document CRUD
│   │   ├── processing/     # PDF/Image processing
│   │   ├── storage/        # File storage backends
│   │   └── ratelimit/      # Rate limiting
│   ├── config/             # Django settings
│   ├── core/               # Shared utilities
│   ├── celery_app/         # Celery configuration
│   └── tests/              # Test suite
│
└── pdf_studio_frontend/    # React frontend
    └── src/
        ├── api/            # API client
        ├── components/     # React components
        ├── hooks/          # Custom hooks
        ├── lib/            # Utilities
        ├── routes/         # TanStack Router routes
        ├── stores/         # Zustand stores
        └── types/          # TypeScript types
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL
- Redis

### Backend Setup

```bash
cd pdf_studio_backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements/dev.txt

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver

# Start Celery worker (in separate terminal)
celery -A celery_app worker -l info
```

### Frontend Setup

```bash
cd pdf_studio_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Docker Setup

```bash
cd pdf_studio_backend

# Build and run
docker-compose up --build
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register/` - Register new user
- `POST /api/v1/auth/login/` - Login (returns JWT)
- `POST /api/v1/auth/token/refresh/` - Refresh access token
- `GET /api/v1/auth/profile/` - Get user profile
- `PUT /api/v1/auth/change-password/` - Change password
- `POST /api/v1/auth/logout/` - Logout (blacklist token)

### Documents
- `GET /api/v1/documents/` - List documents
- `POST /api/v1/documents/` - Upload document
- `GET /api/v1/documents/{id}/` - Get document details
- `PATCH /api/v1/documents/{id}/` - Update document
- `DELETE /api/v1/documents/{id}/` - Delete document
- `POST /api/v1/documents/{id}/duplicate/` - Duplicate document
- `GET /api/v1/documents/{id}/pages/` - Get document pages
- `GET /api/v1/documents/shared/` - List public documents

### Processing
- `POST /api/v1/processing/process_document/` - Process PDF
- `POST /api/v1/processing/run_ocr/` - Run OCR on page
- `POST /api/v1/processing/enhance/` - Enhance image
- `POST /api/v1/processing/dewarp/` - Dewarp image
- `GET /api/v1/processing/task_status/` - Check task status

### Storage
- `GET /api/v1/storage/assets/` - List file assets
- `POST /api/v1/storage/assets/` - Upload file
- `GET /api/v1/storage/assets/{id}/presigned_url/` - Get presigned URL

## Environment Variables

### Backend (.env)
```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_SETTINGS_MODULE=config.settings.production

# Database
DB_NAME=pdf_studio
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://127.0.0.1:6379/0
CELERY_BROKER_URL=redis://127.0.0.1:6379/1

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Storage (optional)
STORAGE_BACKEND=local
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
```

## License

MIT
