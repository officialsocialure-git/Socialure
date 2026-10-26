# Offmint Agency Backend

Express REST API for the agency website. MongoDB connection/startup is intentionally not configured here.

## Setup
1. Install Node.js 20 or later.
2. Run `npm install` in this folder.
3. Copy `.env.example` to `.env`.
4. Set a unique random `JWT_SECRET` (at least 32 characters) and `FRONTEND_URL`.
5. Run `npm run dev`.

The HTTP server can start without MongoDB. Database-backed routes return HTTP 503 until you configure a Mongoose connection.

## API routes
- `GET /api/health` — health check
- `POST /api/auth/login` — admin login (requires an Admin record in MongoDB)
- `GET /api/auth/me` — current admin, with `Authorization: Bearer <token>`
- `POST /api/enquiries` — public enquiry submission
- `GET /api/enquiries?page=1&limit=20&search=&status=` — admin enquiry list/search/filter
- `GET /api/enquiries/export?status=New` — admin CSV export
- `GET /api/enquiries/:id` — enquiry details
- `PATCH /api/enquiries/:id` — update status/notes
- `DELETE /api/enquiries/:id` — delete enquiry
- `GET /api/dashboard/stats` — dashboard KPIs, status breakdown, recent enquiries

Admin routes require a valid Bearer token. There is intentionally no public admin registration route. After your database connection is set up, use `src/services/admin-bootstrap.js` from a trusted one-time local script to create the first admin.

## Notifications
Email uses SMTP configuration in `.env`. WhatsApp uses Meta WhatsApp Cloud API settings. These notifications are optional; if credentials are absent, they are skipped. For WhatsApp, Meta may require approved templates for business-initiated messages outside the customer-service window.

## Still required before production
- Configure MongoDB connection and test all database routes.
- Create the first admin securely.
- Configure provider credentials and production CORS/HTTPS.
- Integrate API calls with the frontend and test end-to-end.
- Review privacy, backups, logging and deployment settings.
