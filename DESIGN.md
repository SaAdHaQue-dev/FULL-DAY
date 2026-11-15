# Taskora Design System & UX Specification (DESIGN.md)

**Product:** Taskora  
**Tagline:** Plan clearly. Get things done.  
**Style:** Modern, Clean, Minimalist Productivity SaaS  
**Version:** 1.0  

---

## 1. Design Principles & Goals

1. **Clarity Over Clutter:** The interface puts user tasks front and center. Secondary actions stay tucked away until requested.
2. **Speed & Direct Manipulation:** Actions like quick-adding tasks, checking off items, changing dates, and toggling views feel instantaneous.
3. **Restrained Elegance:** Neutral palettes with deliberate accent colors for priorities, statuses, and project tags.
4. **Theme First:** Seamless light and dark mode support adhering to system preferences with immediate manual override.
5. **Universal Accessibility (WCAG 2.1 AA):** High-contrast color ratios, visible focus outlines, full keyboard navigation, and screen-reader accessibility.

---

## 2. Design Tokens

### 2.1 Color Palette

#### Primary & Brand
- **Brand Primary:** `#4F46E5` (Indigo 600) / Dark: `#6366F1` (Indigo 500)
- **Brand Accent:** `#06B6D4` (Cyan 500) / `#38BDF8` (Sky 400)
- **Brand Subtle:** `#EEF2FF` (Indigo 50) / Dark: `rgba(99, 102, 241, 0.15)`

#### Neutrals (Light Mode)
- **Background:** `#F8FAFC` (Slate 50)
- **Surface / Card:** `#FFFFFF` (White)
- **Surface Hover:** `#F1F5F9` (Slate 100)
- **Border / Divider:** `#E2E8F0` (Slate 200)
- **Text Primary:** `#0F172A` (Slate 900)
- **Text Secondary:** `#475569` (Slate 600)
- **Text Muted:** `#94A3B8` (Slate 400)

#### Neutrals (Dark Mode)
- **Background:** `#090D16` (Deep Midnight)
- **Surface / Card:** `#111827` (Gray 900)
- **Surface Hover:** `#1F2937` (Gray 800)
- **Border / Divider:** `#1F2937` (Gray 800)
- **Text Primary:** `#F9FAFB` (Gray 50)
- **Text Secondary:** `#9CA3AF` (Gray 400)
- **Text Muted:** `#6B7280` (Gray 500)

#### Semantic Status Tokens
| Status | Light Badge Bg | Light Text | Dark Badge Bg | Dark Text | Meaning |
|---|---|---|---|---|---|
| `todo` | `#F1F5F9` | `#475569` | `#1E293B` | `#94A3B8` | Not yet started |
| `in_progress` | `#EFF6FF` | `#2563EB` | `rgba(37,99,235,0.15)` | `#60A5FA` | Currently being worked on |
| `completed` | `#ECFDF5` | `#059669` | `rgba(5,150,105,0.15)` | `#34D399` | Successfully completed |
| `cancelled` | `#FEF2F2` | `#DC2626` | `rgba(220,38,38,0.15)` | `#F87171` | Abandoned or cancelled |

#### Semantic Priority Tokens
| Priority | Color | Indicator Dot / Tag |
|---|---|---|
| `low` | `#64748B` (Slate) | Subtle gray tag |
| `medium` | `#2563EB` (Blue) | Cool blue tag |
| `high` | `#EA580C` (Orange) | Vibrant warm orange |
| `urgent` | `#DC2626` (Red) | Bold red with alert ring |

---

### 2.2 Typography
- **Font Family:** `Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace (Dates / IDs / Code):** `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

| Style | Size | Weight | Line Height | Tracking |
|---|---|---|---|---|
| Display / H1 | 28px (1.75rem) | 700 (Bold) | 1.2 | -0.02em |
| Heading 2 | 22px (1.375rem) | 600 (Semibold) | 1.3 | -0.015em |
| Heading 3 | 18px (1.125rem) | 600 (Semibold) | 1.4 | -0.01em |
| Body Regular | 14px (0.875rem) | 400 (Regular) | 1.5 | 0 |
| Body Medium | 14px (0.875rem) | 500 (Medium) | 1.5 | 0 |
| Small / Label | 12px (0.75rem) | 500 (Medium) | 1.4 | +0.01em |
| Tiny / Timestamp| 11px (0.6875rem)| 400 (Regular) | 1.3 | +0.02em |

---

### 2.3 Spacing, Radii & Shadows
- **Base Unit:** 4px
- **Border Radii:**
  - `sm`: 6px (Badges, tags, chips)
  - `md`: 8px (Buttons, text inputs, list items)
  - `lg`: 12px (Cards, modal dialogs, dropdowns)
  - `xl`: 16px (Flyout drawers, dashboard stat containers)
  - `full`: 9999px (Pills, avatar circles)
- **Elevation / Shadows:**
  - `sm`: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
  - `md`: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
  - `lg`: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
  - `panel`: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`

---

## 3. Application Shell & Layout Architecture

### 3.1 Layout Anatomy
```
+-----------------------------------------------------------------------------------+
|  [Logo] Taskora    | [Search ⌘K]                 [+ Add] [Voice] [🔔] [Theme] [User]
+--------------------+--------------------------------------------------------------+
|  📊 Dashboard      | Page Header: "Today"  [Filter] [Sort] [View: List/Board]      |
|  📥 Inbox          |--------------------------------------------------------------|
|  ☀️ Today          | [ ] 🔴 Finish Q3 Financial Report       Due Today  #Finance  ... |
|  📅 Upcoming       | [ ] 🟡 Review landing page copy         Due 4 PM   #Marketing... |
|  📋 All Tasks      | [x] 🟢 Morning standup meeting          Completed  #Team     ... |
|  ----------------- |                                                              |
|  📁 Projects       |                                                              |
|   • Product Launch |                                                              |
|   • Personal Goals |                                                              |
|  ----------------- |                                                              |
|  🗓️ Calendar        |                                                              |
|  📈 Analytics      |                                                              |
|  ⚙️ Settings       |                                                              |
+--------------------+--------------------------------------------------------------+
```

1. **Collapsible Sidebar (Left):**
   - Width: 260px expanded, 72px icon-only collapsed, off-canvas drawer on mobile.
   - Houses Primary Views (Dashboard, Inbox, Today, Upcoming, All Tasks, Completed), Projects list, and Utilities (Calendar, Analytics, Settings).
2. **Top Application Bar:**
   - Global Quick Search with `Cmd/Ctrl + K` keyboard shortcut.
   - Quick Add Task Button `+ New Task` with `Cmd/Ctrl + N` shortcut.
   - Voice Command input activation microphone pill.
   - In-app Notification center drawer toggle with unread counter badge.
   - Theme switch toggle (Light / Dark / System).
   - Profile avatar with popup dropdown (Account, Workspaces, Sign Out).
3. **Main Content Viewport:**
   - Contextual header with page title, task count counter, quick action buttons, and filter/sort toolbar.
   - Responsive grid/list container supporting lazy loading and animated state transitions.
4. **Task Detail Slide-over Panel:**
   - 420px fly-in drawer on desktop, full-screen sheet on mobile.
   - Contains editable title, markdown description, date picker, priority selector, project dropdown, label management, comments thread, and audit activity stream.

---

## 4. Component Patterns & States

### 4.1 Task Item Component
- **Checkbox:** Crisp rounded checkbox with animated checkmark and strikethrough upon completion.
- **Priority Indicator:** Color-coded flag or subtle pill.
- **Metadata Line:** Due date badge (highlighted red when overdue, amber when due today), project indicator with color dot, and labels.
- **Quick Hover Actions:** Edit, Delete, Reschedule, More options (`...`).

### 4.2 Empty States
Every primary view includes a friendly, non-intrusive empty state:
- Icon (e.g. CheckCircle for Today when all caught up).
- Headline: "You're all caught up for today!"
- Subtitle: "Relax, or plan ahead by scheduling upcoming tasks."
- Direct Call to Action button: "+ Add a task".

### 4.3 Loading States
- Subtle shimmer skeleton rows rather than jarring full-page spinners.

### 4.4 Error Feedback
- Form field inline error messages in red.
- Global toast notifications (top-right or bottom-right) with auto-dismiss in 4 seconds.

---

## 5. Responsive Breakpoints

- **Mobile (`< 640px`):** Sidebar slides off-canvas behind hamburger menu; top search collapses into an icon; task item metadata wraps gracefully; modal drawers become bottom sheets.
- **Tablet (`640px - 1024px`):** Sidebar collapses to compact icon rail or expandable overlay; 2-column dashboard layout.
- **Desktop (`>= 1024px`):** Full 260px sidebar visible; 3-column dashboard; dual-pane task view with persistent or side-docked detail inspector.

---

## 6. Accessibility & Keyboard Shortcuts

- `Cmd/Ctrl + K`: Open global search.
- `Cmd/Ctrl + N`: Open Quick Add Task modal.
- `Escape`: Close open drawers, modals, or dropdowns.
- `Tab / Shift+Tab`: Consistent sequential keyboard focus with visible `focus-visible:ring-2` styling.
- Screen readers receive appropriate ARIA labels on all icon-only buttons (`aria-label="Add task"`, `aria-label="Toggle notifications"`).
