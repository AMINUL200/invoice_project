// components/invoiceTemplates/index.js
import DefaultTemplate from './DefaultTemplate';
// Import other templates as you create them
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';

export const TEMPLATES = {
  DEFAULT: { id: 0, name: 'Default', component: DefaultTemplate },
  CLASSIC: { id: 1, name: 'Classic', component: ClassicTemplate }, // Replace with ClassicTemplate when ready
  MODERN: { id: 2, name: 'Modern', component: ModernTemplate },   // Replace with ModernTemplate when ready
  MINIMAL: { id: 3, name: 'Minimal', component: MinimalTemplate },  // Replace with MinimalTemplate when ready
  PROFESSIONAL: { id: 4, name: 'Professional', component: ProfessionalTemplate } // Replace with ProfessionalTemplate when ready
};

// Helper function to get template by ID
export const getTemplateById = (id) => {
  const templateMap = {
    0: TEMPLATES.DEFAULT,
    1: TEMPLATES.CLASSIC,
    2: TEMPLATES.MODERN,
    3: TEMPLATES.MINIMAL,
    4: TEMPLATES.PROFESSIONAL
  };
  return templateMap[id] || TEMPLATES.DEFAULT;
};