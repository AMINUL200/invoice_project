# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





1. CORE BRAND COLORS

Primary Color: #2563EB (Main action color)
Primary Hover: #1D4ED8
Application Background: #F8FAFC
Card Background: #FFFFFF
Border Color: #E2E8F0

Heading Text: #0F172A
Body Text: #64748B
Muted Text: #94A3B8

2. SIDEBAR COLOR SYSTEM

Sidebar Background: #0F172A
Sidebar Text Default: #94A3B8
Sidebar Icon Color: #CBD5F5

Sidebar Hover Background: #1E293B
Sidebar Active Background: #2563EB
Sidebar Active Text: #FFFFFF

Divider Line: #1E293B

Purpose:

Dark sidebar reduces eye strain

Highlights main content area

3. TOP NAVBAR COLORS

Navbar Background: #FFFFFF
Navbar Bottom Border: #E2E8F0

Icon Color: #475569
Search Background: #F1F5F9

Notification Badge: #EF4444
Profile Dropdown Background: #FFFFFF

4. CARD / DASHBOARD WIDGETS

Card Background: #FFFFFF
Card Border: #E2E8F0
Card Shadow: Soft shadow (light elevation)

Card Hover Shadow: Medium shadow

Card Title Text: #0F172A
Card Description Text: #64748B

5. INVOICE TABLE DESIGN

Table Header Background: #F1F5F9
Table Header Text: #334155

Row Background: #FFFFFF
Row Hover Background: #F8FAFC

Row Border: #E2E8F0

Primary Table Text: #334155
Secondary Table Text: #64748B

6. BUTTON COLOR SYSTEM

PRIMARY BUTTON (Create / Save)
Background: #2563EB
Hover: #1D4ED8
Text: #FFFFFF

SECONDARY BUTTON
Background: #FFFFFF
Border: #CBD5E1
Text: #334155
Hover Background: #F8FAFC

SUCCESS BUTTON (Mark Paid)
Background: #22C55E
Hover: #16A34A
Text: White

DANGER BUTTON (Delete)
Background: #EF4444
Hover: #DC2626
Text: White

WARNING BUTTON
Background: #F59E0B
Hover: #D97706

7. INVOICE STATUS BADGES

Paid
Background: #DCFCE7
Text: #15803D

Pending
Background: #FEF3C7
Text: #B45309

Overdue
Background: #FEE2E2
Text: #B91C1C

Draft
Background: #DBEAFE
Text: #1D4ED8

Cancelled
Background: #E2E8F0
Text: #475569

8. FORM INPUT DESIGN (CREATE INVOICE PAGE)

Input Background: #FFFFFF
Input Border: #CBD5E1
Input Text: #0F172A

Placeholder Text: #94A3B8

Focus Border: #2563EB
Focus Ring: Light Blue Glow

Error Border: #EF4444
Success Border: #22C55E

Label Text: #334155

9. TOAST NOTIFICATIONS

Success Toast Color: #22C55E
Error Toast Color: #EF4444
Info Toast Color: #2563EB
Warning Toast Color: #F59E0B

Toast Background: #FFFFFF
Toast Text: #0F172A

10. PAGE LAYOUT COLORS

Main Page Background: #F8FAFC

Content Section Background: #FFFFFF

Section Border: #E2E8F0

Divider Line: #E5E7EB

11. INVOICE STATUS COLOR LOGIC (UX RULE)

Green → Paid invoices
Orange → Pending payment
Red → Overdue payment
Blue → Draft invoice
Gray → Cancelled invoice

This allows users to understand invoice state instantly.

12. DESIGN PRINCIPLES (IMPORTANT)

Use blue only for primary actions.
Avoid too many bright colors.
Keep tables highly readable.
Maintain strong contrast for financial data.
Use soft gray backgrounds to reduce eye fatigue.










 <!-- <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
              <table className="w-full min-w-[700px]"> -->