# Skill: Personal Expense Tracker Mobile App

## Role

Act as a senior React Native engineer and product designer. Build a polished, reliable, offline-first personal expense tracker. Prioritize correctness, fast interactions, clear information hierarchy, accessibility, and maintainable code over unnecessary complexity.

## Product goal

Create a mobile app for personal monthly expense tracking. The user should be able to add, edit, delete, search, filter, and review expenses; understand spending by month and category; and see clear bar charts. The app is for Indian currency only.

## Recommended technology stack

Use this stack unless the existing repository or the user explicitly requires something else:

- **React Native + Expo + TypeScript**: cross-platform mobile development with a quick development workflow.
- **Expo Router**: file-based navigation.
- **Expo SQLite**: durable local database for expenses, categories, budgets, and settings. The app must work without an account or internet connection.
- **React Native Reanimated**: only for small, purposeful animations; avoid decorative animation that delays interactions.
- **React Native SVG + a maintained chart library compatible with the installed Expo SDK**: render monthly bar charts. Verify compatibility before choosing or installing a chart library; do not guess package versions.
- **Lucide React Native** (or another maintained icon set already in the project): consistent line icons.
- **Expo Haptics**: optional subtle haptic feedback for important actions.
- **Zod**: validate form inputs and imported data at boundaries.
- **date-fns**: date formatting and month calculations.
- **React Hook Form**: optional for non-trivial forms; keep simple forms simple.
- **Zustand**: optional lightweight UI state. SQLite remains the source of truth for persisted financial data.
- **Jest + React Native Testing Library**: unit and component tests, using the project's compatible setup.

Do not add a backend, login, analytics, or cloud sync for the first version. Keep the app local-first. If cross-device sync is requested later, design it as a separate feature with explicit privacy and conflict-resolution decisions.

Official references:
- Expo SQLite: https://docs.expo.dev/versions/latest/sdk/sqlite/
- Expo local-first guide: https://docs.expo.dev/guides/local-first/
- React Native performance: https://reactnative.dev/docs/performance

## Core requirements

### 1. Currency and money handling

- Currency is **INR only**. Display the `₹` symbol and Indian digit grouping, e.g. `₹1,25,000.00` where decimals are relevant.
- Do not offer currency conversion or any foreign-currency option.
- Store monetary amounts as integer paise (`amountPaise`) to avoid floating-point rounding errors. Convert to rupees only for display and chart labels.
- Validate that expense amounts are greater than zero and within a sensible maximum.
- Use `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })` where supported, and test the exact display on target devices. If a formatter produces unwanted decimals, provide a consistent INR formatting helper.
- Use local calendar dates. Avoid UTC conversion bugs that can move an expense to the previous/next day.
- For charts and summaries, aggregate integer paise first and format only the final values.

### 2. Expense management

Each expense should support:
- Amount (required)
- Category (required)
- Date (required; default to today)
- Optional note/description
- Optional payment method
- Optional merchant or place
- Created/updated timestamps
- Optional recurring marker only if recurring expenses are implemented fully

Required actions:
- Add expense quickly with minimal taps.
- Edit an existing expense.
- Delete with a confirmation or undo affordance.
- Search notes/merchant and filter by month, category, and payment method.
- Sort newest first by default; optionally sort by amount.
- Show useful empty states and validation messages.
- Persist changes across app restarts.

### 3. Suggested categories

Provide a broad starter set. Use category IDs that remain stable if labels are renamed. Each category should have a label, emoji, icon name, and optional display color. Let the user add, rename, reorder, archive, or restore custom categories. Do not hard-delete categories that are used by historical expenses; archive them instead.

Suggested categories (the user may customize these):

**Home and bills**
- Rent / PG
- Electricity
- Water
- Gas cylinder
- Internet / Wi-Fi
- Mobile recharge
- DTH / subscriptions
- Household supplies
- Repairs and maintenance
- Furniture and appliances
- Laundry

**Food and groceries**
- Groceries
- Vegetables and fruits
- Dairy
- Snacks
- Tea / coffee
- Restaurant / dining
- Takeaway / food delivery
- Street food
- Office meals
- Drinking water

**Travel and transport**
- Bus
- Train
- Metro
- Auto-rickshaw
- Taxi / cab
- Fuel
- Parking
- Toll
- Vehicle service
- Bicycle
- Flights
- Hotel / stay

**Personal and lifestyle**
- Clothing
- Footwear
- Grooming
- Haircut / salon
- Skincare
- Personal care
- Gym / fitness
- Sports
- Hobbies
- Entertainment
- Shopping
- Gifts
- Social outings

**Health and education**
- Doctor
- Medicines
- Dental / eye care
- Health tests
- Insurance
- Courses
- Books and stationery
- Education fees
- Certifications

**Digital and financial**
- Streaming subscriptions
- Apps / software
- Cloud storage
- Bank charges
- Credit card fees
- Loan repayment
- Investment contribution
- Taxes
- Donations / charity

**Work and miscellaneous**
- Office supplies
- Work travel
- Professional expenses
- Family support
- Pet care
- Travel planning
- Emergency
- Other

Avoid making category lists visually overwhelming. Use a searchable category picker with grouped categories and a favourites/recent section.

### 4. Monthly dashboard and charts

Dashboard should show:
- Total spent in the selected month
- Number of transactions
- Average daily spend (based on elapsed days or the full month; label the chosen method clearly)
- Highest-spend category
- Comparison with the previous month (amount and percentage; handle zero previous-month spend safely)
- A bar chart of monthly spending, with month labels and INR axis/tooltip labels
- A category breakdown, such as ranked rows or a compact donut chart if it improves clarity
- Recent transactions

Chart requirements:
- Default to the latest 6 months; allow 3, 6, and 12-month ranges if practical.
- Clearly distinguish zero-spend months from missing data.
- Keep labels readable on narrow screens; avoid clutter.
- Ensure chart values and totals use the same aggregation logic.
- Provide accessible text summaries for charts.
- Do not invent sample data in production screens. If demo data is used in development, label it clearly and keep it out of real user totals.

### 5. Budgets (optional but recommended)

Allow a user to set a monthly overall budget and optional category budgets. Show remaining amount and percentage used. Clearly indicate when a budget is exceeded without using alarming colors for ordinary spending. Do not silently create budgets or change them.

### 6. Export, backup, and privacy

- Provide CSV export for expenses with date, amount in INR, category, note, and payment method.
- If feasible, provide a database backup/restore flow with validation and a confirmation step.
- Clearly warn before destructive actions such as clearing all data.
- Do not collect, transmit, or log financial data.
- Do not add permissions that are not required.
- Treat local data as private, but do not claim it is encrypted unless encryption is implemented and verified.
- Consider app-lock/biometric protection as a future opt-in feature, not a substitute for secure storage.

## UI and visual design

### Visual direction

Aim for a clean, sophisticated, modern personal-finance aesthetic:
- Calm neutral background, strong text contrast, one primary accent color, and restrained semantic colors.
- Consistent spacing scale, rounded cards, subtle borders, and limited shadows.
- Clear typography hierarchy; large figures for the main monthly total.
- Use emojis sparingly as category identifiers, paired with consistent icons where useful. Never use emoji as the only indicator of meaning.
- Avoid excessive gradients, glassmorphism, glowing effects, noisy backgrounds, or overdecorated cards.
- Support light and dark themes if feasible; keep contrast accessible in both.
- Use subtle haptics and quick transitions only where they improve feedback.
- Ensure buttons and touch targets are comfortable to use one-handed.

### Main screens

1. **Dashboard**: month selector, monthly total, bar chart, category summary, recent expenses, prominent add button.
2. **Add/Edit Expense**: amount entry, category picker, date, optional note, optional payment method; keyboard-friendly layout.
3. **Transactions**: searchable list, month/category filters, edit/delete actions.
4. **Insights**: month-to-month trends, category ranking, budget status if implemented.
5. **Settings**: manage categories, export/backup, theme, and data-clear action.

Use a bottom tab bar with a small number of destinations. Keep the primary “Add expense” action easy to reach. Do not add screens without a clear use case.

### UX details

- Amount field should open a numeric keypad and preserve entered values during validation errors.
- Save should be immediate and show clear success feedback.
- Prevent double submissions.
- Use skeletons only when genuinely loading; local database screens should normally appear quickly.
- Include empty states with a direct next action.
- Use accessible labels for icon-only buttons.
- Respect device safe areas, keyboard behavior, and Android back navigation.
- Avoid tiny chart labels and color-only distinctions.

## Data model

Use a small relational schema with migrations. Suggested entities:

### Expense
- `id`: stable unique ID
- `amountPaise`: integer, positive
- `categoryId`: foreign key
- `expenseDate`: local calendar date represented consistently (for example `YYYY-MM-DD`)
- `note`: nullable text
- `merchant`: nullable text
- `paymentMethod`: nullable enum/string
- `createdAt`: timestamp
- `updatedAt`: timestamp

### Category
- `id`: stable unique ID
- `name`: string
- `emoji`: string
- `iconName`: string
- `groupName`: string
- `isSystem`: boolean
- `isArchived`: boolean
- `sortOrder`: integer

### MonthlyBudget (if implemented)
- `id`: stable unique ID
- `yearMonth`: `YYYY-MM`
- `amountPaise`: positive integer
- `categoryId`: nullable; null means overall budget
- `createdAt`, `updatedAt`

Use parameterized SQL queries. Add indexes for common filtering paths, especially expense date and category/date. Use migrations rather than dropping/recreating the database when the schema changes. Enable and test foreign-key constraints. Define a policy for category deletion so historical transactions remain valid.

## Architecture and code quality

- Use TypeScript strict mode and explicit domain types.
- Separate UI components, feature logic, database access, and formatting utilities.
- Suggested structure:

  ```
  app/
    (tabs)/
      index.tsx
      transactions.tsx
      insights.tsx
      settings.tsx
    expense/
      new.tsx
      [id].tsx
  src/
    components/
    features/
      expenses/
      categories/
      budgets/
      insights/
    db/
      schema.ts
      migrations/
      expenseRepository.ts
      categoryRepository.ts
    hooks/
    utils/
      currency.ts
      dates.ts
      aggregates.ts
    types/
  ```

- Reuse shared components for buttons, inputs, cards, category icons, and empty states.
- Keep database operations in repositories/services, not directly inside presentational components.
- Use transactions for multi-step database writes.
- Centralize money formatting, date formatting, category definitions, and monthly aggregation.
- Avoid giant components, duplicated SQL, unnecessary abstractions, and premature backend infrastructure.
- Keep dependencies minimal and compatible with the selected Expo SDK. Use `npx expo install` for Expo-managed native dependencies.
- Never leave core actions as TODOs or fake buttons. If a feature is not implemented, hide it or mark it clearly as incomplete.

## Performance requirements

- Prioritize perceived speed and smooth scrolling on a typical mid-range Android phone.
- Keep dashboard queries aggregated in SQLite where appropriate instead of loading every historical transaction into memory.
- Use FlatList (or another appropriate virtualized list) for long transaction lists.
- Avoid unnecessary component re-renders; memoize only where profiling or clear render patterns justify it.
- Avoid expensive synchronous work on the UI thread.
- Keep chart rendering lightweight and avoid excessive animations.
- Use stable keys and avoid rendering large lists of off-screen items.
- Test a release build as well as development mode; development tooling can distort performance.
- Do not promise “zero lag.” Measure performance, identify bottlenecks, and fix them.

## Validation and edge cases

Test all of the following:
- Empty database and first launch
- Adding, editing, deleting, and cancelling an expense
- Invalid, zero, negative, very large, and decimal amount input
- Amounts with paise and correct INR formatting
- Month/year boundaries, leap years, and local dates around midnight
- Expenses with archived categories
- Empty months and months with high transaction counts
- Previous-month comparison when previous spend is zero
- Filtering and searching with no matches
- Database migration from an older schema
- App restart and offline use
- CSV export with commas, quotes, and newlines in notes
- Backup restore validation, if implemented
- Light/dark theme and small-screen layout
- Keyboard opening, safe areas, and Android back navigation

## Testing expectations

- Unit-test money formatting, date/month helpers, totals, averages, percentage comparisons, and category aggregation.
- Test repository methods against a test database where feasible.
- Test key forms and user journeys with React Native Testing Library.
- Run TypeScript checks, linting, and tests before declaring a task complete.
- Manually verify the app on an Android emulator or physical Android device. Verify iOS too if iOS is in scope.
- Confirm charts exactly match the underlying transaction totals.

## Suggested implementation order

1. Inspect the existing repository and identify its framework, package manager, and current conventions before changing files.
2. Create the Expo + TypeScript app if no project exists.
3. Set up navigation, theme tokens, typography, and reusable UI primitives.
4. Create SQLite schema, migrations, seed default categories, and repositories.
5. Implement add/edit/delete expense flows with validation.
6. Implement transaction list, search, and filters.
7. Build monthly aggregates and dashboard cards.
8. Add bar chart and category insights.
9. Add budgets, export, and backup only after the core app is reliable.
10. Test edge cases, accessibility, release performance, and data persistence.
11. Document setup, scripts, decisions, and known limitations in the project README.

## Agent working rules

- Before coding, inspect the repository and summarize the existing state briefly.
- If the user asks for a feature, implement it end-to-end: UI, persistence, validation, and tests where relevant.
- Make the smallest coherent change that solves the task.
- Verify dependency versions and Expo SDK compatibility rather than assuming.
- Do not replace working architecture without a clear reason.
- Never fabricate test results. Report which commands were actually run and whether they passed.
- If blocked by a missing requirement, ask one concise question; otherwise make reasonable, reversible assumptions and state them.
- Preserve user data during migrations and upgrades.
- At completion, report files changed, features implemented, tests run, and any remaining limitations.

