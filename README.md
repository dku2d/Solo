# Solo
# PropertyHub full-stack starter

This project includes a React frontend and a Flask backend with SQLite. The dashboard is styled to match the Figma screenshot you shared: left sidebar, top search bar, login link, profile circle, and three stat cards.

## Demo login
- Email: `admin@propertyhub.com`
- Password: `Password123!`

## Run the backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

The backend runs on `http://127.0.0.1:5000`.

## Run the frontend
Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://127.0.0.1:5173`.

## Figma extraction workflow
1. In Figma, select the full frame of the dashboard.
2. Turn on the right sidebar and inspect each layer:
   - frame width and height
   - spacing and padding
   - border radius
   - stroke color
   - fill color
   - font size and weight
3. For icons, either:
   - export them as SVG, or
   - match them using an icon library like `lucide-react`
4. Copy text content and component names from Figma.
5. Rebuild the layout in code using:
   - CSS Flexbox for the sidebar and topbar
   - CSS Grid for the dashboard cards
6. Export images only when needed. For a layout like this, most of the design should be recreated in code instead of exported as PNG.
7. In Dev Mode, copy exact measurements from Figma and paste them into your CSS.

## Main API endpoints
- `POST /auth/login`
- `GET /dashboard/stats`
- `GET /properties`
- `POST /properties`
- `GET /tenants`
- `POST /tenants`
- `GET /payments`
- `GET /maintenance`

All dashboard endpoints require a Bearer token from login.

## Database
SQLite database file:
- `backend/instance/propertyhub.db`

It is created automatically the first time you run the backend.
