# Design Guidelines: Multi-Tenant Hotel Management SaaS

## Design Approach

**System-Based Approach** using principles from Carbon Design System and Linear, optimized for data-dense enterprise applications. This platform prioritizes clarity, efficiency, and hierarchical information architecture to support complex hotel and restaurant operations.

**Key Design Principles:**
1. **Information Clarity** - Dense data must be scannable and actionable
2. **Role-Based Hierarchy** - Different user types see tailored interfaces
3. **Operational Efficiency** - Minimal clicks for frequent tasks
4. **Professional Trust** - Enterprise-grade appearance for business credibility

---

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts CDN) - UI elements, data tables, body text
- Monospace: JetBrains Mono - numerical data, IDs, timestamps

**Type Scale:**
- Headings: text-3xl (dashboard titles), text-2xl (section headers), text-xl (card headers)
- Body: text-base (default), text-sm (table cells, labels), text-xs (metadata, timestamps)
- Weight Hierarchy: font-bold (titles), font-semibold (labels, headers), font-medium (interactive elements), font-normal (body)

---

## Layout System

**Spacing Primitives:**
Core spacing values: **2, 4, 6, 8, 12, 16, 20, 24** (Tailwind units)

- Component padding: p-4 to p-6
- Section spacing: py-8 to py-12
- Grid gaps: gap-4 to gap-6
- Card spacing: p-6
- Form field spacing: space-y-4
- Table cell padding: px-4 py-3

**Container Structure:**
- Max-width for content areas: max-w-7xl
- Sidebar width: w-64 (desktop), hidden on mobile with slide-out drawer
- Main content: flex-1 with p-6 to p-8
- Dashboard grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

---

## Component Library

### Navigation & Structure

**Primary Navigation:**
- Fixed sidebar (desktop): Full-height with logo, main nav items, user profile footer
- Mobile: Collapsible hamburger menu with slide-out drawer
- Breadcrumbs: Show page hierarchy for deep navigation (Reservations > Reservation #1234 > Edit)

**Top Bar:**
- Contains: Hotel selector (multi-tenant), notifications bell with badge, user avatar dropdown
- Height: h-16 with border-b
- Sticky positioning: sticky top-0

**Tab Navigation:**
- Used for module switching (Overview / Reservations / Restaurant / Reports)
- Implementation: Underline-style active state with subtle weight change

### Data Display Components

**Tables:**
- Striped rows for improved scanability
- Sticky headers on scroll
- Action column (right-aligned) with icon buttons
- Compact mode: py-2 px-3 for cells
- Responsive: Stack as cards on mobile (< 768px)
- Include: Search bar, filters dropdown, column sorting, pagination

**Cards:**
- Consistent structure: p-6, rounded corners, subtle elevation
- Header: flex justify-between with title and action button
- Body: Structured with clear labels and values
- Stats cards: Grid layout with icon, large number (text-3xl font-bold), label below

**Calendar/Schedule Views:**
- Grid-based weekly/monthly view
- Each cell shows: Room number, guest name, status indicator
- Color-coded by status (use border/background patterns, not color names)
- Click to expand reservation details

### Forms & Inputs

**Form Layout:**
- Two-column grid on desktop (grid-cols-2 gap-6), single column mobile
- Full-width for complex inputs (textarea, rich selects)
- Grouped sections with dividers and section headers
- Required field indicators
- Inline validation messages

**Input Fields:**
- Standard height: h-10 to h-12
- Padding: px-4
- Labels: text-sm font-medium mb-2
- Helper text: text-xs below input
- Disabled state: Clear visual distinction

**Specialized Inputs:**
- Date/time pickers with calendar popover
- Currency inputs with HTG/USD toggle
- Room selector with availability preview
- Multi-select for permissions/roles
- File upload for ID cards and documents

### Action Components

**Buttons:**
- Primary actions: Prominent with solid treatment
- Secondary actions: Outlined or ghost style
- Sizes: h-10 (default), h-8 (compact tables), h-12 (emphasis)
- Icons: Leading or trailing, from Heroicons
- Loading states: Spinner + disabled

**Dropdowns & Menus:**
- Right-aligned for action menus
- Left-aligned for navigation
- Dividers between logical groups
- Icons for menu items where helpful

### Feedback & Status

**Status Badges:**
- Small rounded pills: px-3 py-1 text-xs font-medium
- Used for: Reservation status, payment status, room availability
- Position: Inline with related content

**Notifications/Alerts:**
- Toast notifications: Fixed bottom-right on desktop
- Inline alerts: Full-width with icon, message, optional action
- Types: Success, error, warning, info

**Loading States:**
- Skeleton screens for tables and cards
- Spinner for inline actions
- Progress bars for multi-step processes (check-in wizard)

### Dashboard-Specific Components

**KPI Widgets:**
- 3-4 column grid on desktop
- Contains: Icon, metric value (large), label, trend indicator
- Quick stats: Today's check-ins, occupancy %, revenue

**Charts:**
- Line charts: Revenue over time, occupancy trends
- Bar charts: Room type performance, restaurant sales by category
- Pie charts: Payment method breakdown
- Libraries: Chart.js or Recharts via CDN

**Activity Feed:**
- Chronological list with timestamps
- Icons for event types (check-in, payment, alert)
- Compact format: text-sm with subtle dividers

---

## Module-Specific Layouts

### Hotel Dashboard (Main)
- 4-column KPI grid at top
- Two-column layout: Left (calendar/reservations preview), Right (alerts + quick actions)
- Bottom: Recent activity table

### Reservations Module
- Filter bar: Date range, room type, status dropdowns
- Main view toggle: Calendar grid OR table list
- Detail panel: Slide-out or modal with full reservation info

### Restaurant Module
- Tab structure: Menu | Inventory | Sales | Reports
- Inventory table with alert indicators for low stock
- Sales entry form: Quick add items, room assignment, payment method
- Stock cards with current quantity vs. threshold

### Super Admin Dashboard
- Top: Global metrics (MRR, total hotels, active subscriptions)
- Hotels table with: Name, plan, status, last activity, actions
- Analytics section: Multi-chart layout

### Reports Section
- Report type selector (sidebar or tabs)
- Date range picker (prominent)
- Export button (PDF/CSV) in header
- Data visualization + supporting table
- Printable layout consideration

---

## Responsive Breakpoints

- **Mobile** (< 768px): Single column, stacked cards, hamburger nav, bottom action bar
- **Tablet** (768px - 1024px): Two-column grids, visible sidebar
- **Desktop** (> 1024px): Full multi-column layouts, persistent sidebar

**Mobile-First Considerations:**
- Touch-friendly targets: min h-12 for buttons
- Bottom navigation for frequent actions
- Swipe gestures for calendar navigation
- Simplified tables (card format)

---

## Accessibility Standards

- Semantic HTML throughout
- ARIA labels for icon-only buttons
- Keyboard navigation support (focus indicators)
- Form labels properly associated
- Color-independent status indicators (icons + text)
- Minimum contrast ratios maintained
- Screen reader-friendly table structures

---

## Images & Visual Assets

**Icons:** Heroicons (outline for navigation, solid for status/actions)

**Images:**
- No hero images for this application (utility-focused)
- Hotel logo: Small display in sidebar and top bar (h-8 to h-10)
- User avatars: Rounded, 32px or 40px diameter
- Placeholder images: For rooms without photos in admin
- Document previews: ID cards, invoices (thumbnail + modal view)

**Illustrations:** Optional empty states for tables ("No reservations yet" with simple SVG graphic)

---

This design system creates a professional, efficient interface that balances information density with usability, supporting complex hotel operations while maintaining clarity across all user roles and devices.