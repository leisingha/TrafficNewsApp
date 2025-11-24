# Traffic News App - Implementation Plan

## 1. Technology Stack & Tools

- **Framework**: React (via Vite)
- **Language**: JavaScript (ES6+)
- **UI Library**: Material UI (MUI) - `@mui/material`, `@emotion/react`, `@emotion/styled`
- **Icons**: Material Icons - `@mui/icons-material`
- **Map Library**: React Leaflet - `react-leaflet`, `leaflet`
- **Routing**: React Router DOM - `react-router-dom`
- **State Management**: React Context API (or simple state for this scale)
- **Build Tool**: Vite

## 2. Architectural Structure (3-Layered)

We will strictly enforce the separation of concerns as defined in the architecture document.

```
src/
├── presentation/       # Layer 1: View (UI Components)
│   ├── components/     # Reusable UI blocks (Cards, Forms)
│   ├── pages/          # Main screens (ListView, MapView)
│   └── layouts/        # App shell (Navbar, Sidebar)
├── business/           # Layer 2: Application Logic (Services)
│   ├── services/       # IncidentService, ValidationService, etc.
│   └── models/         # Domain entities (Incident, Route)
└── data/               # Layer 3: Persistence (Repositories)
    ├── repositories/   # IncidentRepository
    └── adapters/       # LocalStorageAdapter, MapAPIAdapter
```

## 3. Implementation Phases

### Phase 1: Project Initialization & Scaffolding

**Goal**: Set up the development environment and folder structure.

1.  Initialize project with Vite: `npm create vite@latest traffic-news-app -- --template react`
2.  Install dependencies:
    - `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material`
    - `npm install leaflet react-leaflet`
    - `npm install react-router-dom`
    - `npm install uuid` (for generating unique IDs)
3.  Create the directory structure (`presentation`, `business`, `data`).
4.  Clean up default Vite boilerplate.

### Phase 2: Business Logic Layer (Services)

**Goal**: Implement the core rules and workflows first, strictly following the Class Diagram.

1.  **Define Domain Models**: Implement classes/structures strictly following the Domain Model Diagram.
    - **Enums**: `IncidentType` (ACCIDENT, CONSTRUCTION...), `SeverityLevel` (LOW, MEDIUM, HIGH), `ReportStatus` (PENDING, APPROVED...).
    - **Location**: `latitude`, `longitude`, `address`, `city`. Methods: `distanceTo(other)`.
    - **Incident**: `id`, `type`, `severity`, `location`, `description`, `timestamp`, `status`, `reporterId`.
    - **User**: `id`, `username`, `role`. Methods: `isReporter()`, `isModerator()`.
    - **SavedRoute**: `id`, `name`, `coordinates`, `isActive`. Methods: `containsLocation(loc)`.
    - **MapPin**: `incident`, `location`, `color`.
    - **Filter**: `types`, `severities`, `keywords`. Methods: `matches(incident)`.
    - **Notification**: `message`, `type`, `timestamp`.
    - **ValidationResult**: `isValid`, `errors`, `fieldErrors`.
2.  **ValidationService (C03)**:
    - `validateReport(incident)`
    - `validateLocation(location)`
    - `checkRequiredFields(incident)`
    - `validateIncidentType(type)`
    - `validateSeverity(severity)`
    - `validateUser(user)`
3.  **IncidentService (C02)**:
    - `getAll()`, `getById(id)`
    - `create(incident)`, `update(id, incident)`, `delete(id)`
    - `sortByTime()`, `sortBySeverity()`, `sortByDistance(location)`
    - `filterBy(filter)`
    - `refresh()`
4.  **FilterService (C04)**:
    - `applyFilter(filter, incidents)`
    - `clearFilters()`
    - `filterByType(type, incidents)`
    - `filterBySeverity(severity, incidents)`
    - `composePredicates(filter)`
    - `getActiveFilter()`
5.  **SearchService (C05)**:
    - `searchByKeyword(keyword, incidents)`
    - `searchByLocation(location, incidents)`
    - `searchByDescription(text, incidents)`
    - `buildSearchIndex(incidents)`
    - `clearIndex()`
6.  **MapViewManager (C06)**:
    - `renderMap(incidents)`
    - `createPin(incident)`
    - `updateViewport(center, zoom)`
    - `showPopup(incident)`
    - `clusterPins(pins)`
    - `centerOnLocation(location)`
    - `refreshTiles()`
7.  **RefreshScheduler (C07)**:
    - `start(callback)`, `stop()`
    - `setInterval(seconds)`
    - `getInterval()`
    - `trigger()`
    - `isRunning()`
8.  **RateLimiterService (C08)**:
    - `checkLimit(userId)`
    - `recordSubmission(userId)`
    - `resetLimit(userId)`
    - `getRemainingSubmissions(userId)`
    - `setMaxSubmissions(max)`
9.  **SavedRoutesService (C10)**:
    - `save(route)`, `list(userId)`, `delete(routeId)`
    - `checkIncidentsNearby(route, incidents)`
    - `activateRoute(routeId)`
    - `deactivateRoute(routeId)`
10. **OfflineSubmissionQueue (C11)**:
    - `enqueue(incident)`, `dequeue()`
    - `retryAll()`
    - `isOnline()`
    - `getQueueSize()`
    - `clearQueue()`
    - `setOnlineStatus(status)`
11. **NotificationService (C12)**:
    - `notify(message, type)`
    - `showBanner(message)`
    - `dismissAll()`
    - `notifyNearbyIncident(incident, route)`
    - `getActiveNotifications()`

### Phase 3: Data Layer (Persistence)

**Goal**: Enable data storage and retrieval to support the business logic, strictly following the Class Diagram.

1.  **LocalStorageAdapter (C09)**:
    - `save(key, value)`
    - `load(key)`
    - `remove(key)`
    - `clear()`
    - `exists(key)`
    - `getAll()`
2.  **IncidentRepository**:
    - `fetch()`
    - `persist(incident)`
    - `query(filter)`
    - `update(id, incident)`
    - `delete(id)`
    - `clearCache()`
3.  **MapServiceAPI**:
    - `getTiles(bounds)`
    - `geocode(address)`
    - `reverseGeocode(location)`
    - `getRoute(start, end)`
    - `isAvailable()`
4.  **Mock Data**: Create a seed script to populate the app with initial dummy data for testing.

### Phase 4: Presentation Layer (UI)

**Goal**: Build the visual interface using Material UI, strictly following the Class Diagram for WebUI (C01).

1.  **WebUI (C01) - Main Controller**:

    - Implement `displayIncidents(incidents)`
    - Implement `showMap(incidents)`
    - Implement `showReportForm()`
    - Implement `displayError(message)`
    - Implement `showNotification(message)`
    - Implement `handleUserInput()`
    - Implement `renderFilterControls()`
    - Implement `renderSearchBar()`
    - Implement `showSavedRoutes()`
    - Implement `showSubmissionStatus()`
    - _Note: In React, these methods will map to specific Components and Hooks._

2.  **Layout**: Create a responsive `Navbar` and `MainLayout` using MUI `AppBar` and `Drawer`.
3.  **Incident List (UC01)**:
    - Create `IncidentCard` component.
    - Create `IncidentList` page that fetches data from `IncidentService`.
4.  **Map Visualization (UC05)**:
    - Implement `MapContainer` using React Leaflet.
    - Render incidents as `Markers` on the map.
5.  **Reporting Form (UC12)**:
    - Create a `ReportDialog` with form inputs (Select, TextField).
    - Connect form submission to `IncidentService.reportIncident()`.
6.  **Feedback & Notifications**: Add `Snackbar` for success/error messages.

### Phase 5: Integration & Polish

**Goal**: Connect all layers and ensure smooth user experience.

1.  **Routing**: Set up `react-router-dom` to switch between List and Map views.
2.  **Auto-Refresh (UC10)**: Implement the `RefreshScheduler` logic in a `useEffect` hook or dedicated service.
3.  **Testing**: Verify all 8 Sequence Diagrams (SD01-SD08) flows manually.
4.  **Styling**: Apply a consistent theme (colors, spacing) using MUI's `ThemeProvider`.
