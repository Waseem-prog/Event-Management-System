# EventHub - Event Management System

A React web app where users can explore events from the Ticketmaster Discovery API, view event details, register for events and manage their registrations.

Built for Web Programming, Assignment 2.

## Features

- **Authentication (frontend simulation):** register (name, email, password), login and logout. Auth state lives in Redux Toolkit and is saved in `localStorage`, so you stay logged in after a refresh.
- **Event exploration:** upcoming events by default, debounced keyword search, filters (city, country, category chips, date range), sorting, an "Upcoming only" toggle and pagination. All data comes from the Ticketmaster Discovery API.
- **Event details:** image, date and time, venue and full address, category and genre, price range, event info and notes, seat map (when available) and a link to buy tickets on Ticketmaster.
- **Event registration:** logged-in users can register for an event and cancel it. Duplicate registrations are prevented and every action shows toast feedback. Registrations belong to the logged-in user.
- **My Events:** the user's registrations, split into Upcoming and Completed, with a confirm step before cancelling.
- **Protected routes:** `/my-events` needs a login (and returns the user to it afterwards). Logged-in users are redirected away from the login and register pages.
- **UI:** responsive layout (phone, tablet, desktop), reusable components, loading skeletons, error messages with a retry button, empty states, form validation and basic accessibility (labels, focus outlines, skip link, page titles).

## Tech stack

- React 19 (functional components and hooks) with Vite
- Redux Toolkit and React Redux
- React Router
- Ticketmaster Discovery API
- Plain CSS, ESLint

## Getting started

**Requirements:** Node.js 20.19 or newer (22.12+ also works) and npm.

1. Clone the repository and install the dependencies:

   ```bash
   git clone https://github.com/Waseem-prog/Event-Management-System.git
   cd Event-Management-System
   npm install
   ```

2. Get a free API key ("Consumer Key") from <https://developer.ticketmaster.com/>.

3. Create your environment file from the example and put your key in it:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell use `Copy-Item .env.example .env`. Then edit `.env`:

   ```
   VITE_TM_API_KEY=your_ticketmaster_consumer_key
   ```

   The `.env` file is git-ignored, so your key is never committed.

4. Start the development server and open the link it prints (usually <http://localhost:5173>):

   ```bash
   npm run dev
   ```

### Other scripts

| Command           | What it does                   |
| ----------------- | ------------------------------ |
| `npm run build`   | Production build into `dist/`  |
| `npm run preview` | Serve the production build     |
| `npm run lint`    | Run ESLint                     |

## Project structure

```
src/
  app/store.js                      configureStore + localStorage persistence
  features/
    auth/authSlice.js               users, current user, login/register/logout
    events/eventsSlice.js           event list, filters, pagination, details, categories
    registrations/registrationsSlice.js   registrations and selectors
  components/                       reusable UI (Navbar, EventCard, SearchBar, FilterBar,
                                    Pagination, Toast, ProtectedRoute, GuestRoute, ...)
  pages/                            Login, Register, Events, EventDetails, MyEvents, NotFound
  services/ticketmaster.js          all calls to the Discovery API
  utils/                            validators, dates, hash, storage, hooks
```

## Routes

| Path           | Page                                         | Access                                  |
| -------------- | -------------------------------------------- | --------------------------------------- |
| `/`            | Redirects to `/events`                       | Public                                  |
| `/events`      | Event list with search, filters, categories  | Public                                  |
| `/events/:id`  | Event details with Register / Cancel         | Public (registering needs a login)      |
| `/my-events`   | The user's registered events                 | Logged-in users only                    |
| `/login`       | Login form                                   | Guests only                             |
| `/register`    | Sign-up form                                 | Guests only                             |
| `*`            | 404 page                                     | Public                                  |

## How Redux is organised

The store (`src/app/store.js`) combines three slices:

- **`auth`**: `{ users, currentUser, error }`. `registerUser` and `loginUser` are async thunks because the password is hashed (SHA-256 with the Web Crypto API) before it is compared or stored. Reducers: `logout`, `clearError`. Duplicate emails (case-insensitive) and wrong credentials are rejected with clear messages.
- **`events`**: `{ items, status, error, page, totalPages, filters, selected, categories, ... }`. Thunks: `fetchEvents`, `fetchEventById`, `fetchCategories`. Changing any filter resets to page 1. Each list request stores its `requestId`, and responses from older requests are ignored, so fast typing never shows stale results.
- **`registrations`**: `{ items }`, where each item is `{ id, userId, eventId, event (snapshot), registeredAt }`. `registerForEvent` ignores a second registration for the same user and event, and `cancelRegistration` removes one. The selectors `selectUserRegistrations` and `selectIsRegistered` only return the logged-in user's data. A snapshot of the event is saved, so My Events works without calling the API again.

A store subscriber writes users, the session and registrations to `localStorage` (keys `ems_users`, `ems_session`, `ems_registrations`) whenever they change. Reading from storage is wrapped in `try/catch`, so corrupt data never crashes the app.

## How the API is used

`src/services/ticketmaster.js` is the only file that talks to Ticketmaster. It adds the API key from `import.meta.env.VITE_TM_API_KEY`, skips empty parameters and turns HTTP and network problems into friendly messages (invalid key, rate limit, connection errors). It uses:

- `events.json` for searching and listing (keyword, city, country, category, date range, sort, page)
- `events/{id}.json` for a single event
- `classifications.json` for the category chips

Search is debounced (about 450 ms) to stay inside the API limit of 2 requests per second. The API only allows `size x page` below 1000, so pagination stops before that limit.

## Notes

- **Authentication is a frontend simulation.** There is no server: users are stored in the browser's `localStorage` and passwords are stored only as SHA-256 hashes. This is not secure authentication and is only meant for this assignment. A real app would use a backend with salted password hashing and tokens.
- Registered users only exist in the browser they signed up in.
- Ticketmaster has little or no inventory in some countries (for example Pakistan), so the country filter is "All countries" by default.
- Many API fields are optional (price, time, venue, image), so the UI always has fallbacks.
