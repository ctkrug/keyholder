// Defines the checklist's structure as plain data, so the document renderer
// (render.js) and the eventual PDF export stay driven by one source of
// truth. New sections/fields are added here without touching render logic.
export const SECTIONS = [
  {
    id: 'basics',
    title: 'Basics',
    fields: [
      { id: 'fullName', label: 'Full legal name', type: 'text' },
    ],
  },
];
