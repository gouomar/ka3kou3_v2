# Architecture Visualization Integration Guide

## Quick Start

### What's New?
When users click the "View Details" button on a project card, they now see an interactive system architecture page with Mermaid diagrams that match your provided design.

### User Flow
```
Dashboard → Project Card → "View Details" Button → /project/[projectId] → Architecture Visualizer
```

## Files Overview

### 1. **[components/architecture-visualizer.tsx](components/architecture-visualizer.tsx)**
The main component rendering the architecture page.

**Key Features:**
- Mermaid diagram initialization and rendering
- Interactive node clicking for modal popups
- Dark theme styling with cyan/violet accents
- Responsive layout with header and back button
- Modal with node details and external resources

**Usage:**
```tsx
<ArchitectureVisualizer
  projectId="1"
  architectureData={projectArchitectures['1']}
/>
```

### 2. **[lib/project-architectures.ts](lib/project-architectures.ts)**
Mock data containing architecture definitions for 6 projects.

**Data Structure:**
```typescript
{
  'projectId': {
    project_title: string,
    promise: string,
    project_overview: string,
    roadmap_mermaid: string,  // Mermaid flowchart definition
    nodes: {
      [nodeId]: {
        title: string,
        explanation: string,
        resources: Array<{ label, url }>
      }
    }
  }
}
```

**Projects Included:**
- ID: 1 - Libft
- ID: 2 - ft_printf
- ID: 3 - get_next_line
- ID: 4 - Philosophers
- ID: 5 - minishell
- ID: 6 - CPP Modules

### 3. **[app/project/[projectId]/page.tsx](app/project/[projectId]/page.tsx)**
Dynamic route page for displaying individual project architectures.

**Features:**
- Fetches architecture data from mock data
- Generates metadata for SEO
- Shows 404 page if project not found
- Server-side data fetching

## Modified Files

### [app/layout.tsx](app/layout.tsx)
**Added to `<head>`:**
```html
<script async src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### [components/project-card.tsx](components/project-card.tsx)
**Changes:**
- Added `Link` import from `next/link`
- Wrapped button in Link component pointing to `/project/{projectId}`
- Maintains existing card styling and animations

## Adding New Projects

To add a new project architecture:

1. **Open** `lib/project-architectures.ts`
2. **Add entry** to `projectArchitectures` object:
```typescript
'7': {
  project_title: 'Your Project',
  promise: 'Your Promise',
  project_overview: 'Your Overview',
  roadmap_mermaid: 'flowchart TD\n...',
  nodes: {
    nodeId: {
      title: 'Node Title',
      explanation: 'Explanation',
      resources: [{ label: 'Link', url: 'https://...' }]
    }
  }
}
```

3. **Update** project ID in `components/roadmap-visualizer.tsx` (if needed)

## Styling Details

### Colors Used
- Background: `#020617` (Slate 950)
- Card: `#0f172a` (Slate 900)
- Primary Accent: `#06b6d4` (Cyan 500)
- Secondary Accent: `#8b5cf6` (Violet 500)
- Text: `#f8fafc` (Slate 50)

### Fonts
- UI: Inter
- Code/Titles: JetBrains Mono

### Interactive Elements
- Hover effects on nodes
- Neon glow on interaction
- Modal animations
- Smooth transitions

## Customization

### Change Diagram Style
Edit the `mermaid.initialize()` call in `ArchitectureVisualizer`:
```typescript
mermaid.initialize({
  theme: 'dark',
  themeVariables: {
    primaryColor: '#0f172a',
    // ... customize colors
  }
})
```

### Modify Modal Appearance
Update Tailwind classes in the modal section:
```tsx
<div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700/50">
  {/* Customize here */}
</div>
```

### Add More Node Types
Extend the Mermaid flowchart syntax in `roadmap_mermaid` string:
```
subgraph MySubgraph ["Custom Group"]
  A[Node] --> B{Decision}
end
```

## Testing

### Test the Flow
1. Navigate to dashboard
2. Hover over a project card
3. Click "View Details"
4. Verify you're on `/project/[projectId]` page
5. Click on diagram nodes
6. Verify modal appears with correct data
7. Click external resources to verify links work
8. Click back button to return to dashboard

### Check Responsiveness
- Test on mobile (375px)
- Test on tablet (768px)
- Test on desktop (1400px+)

## Performance Notes

- Mermaid is loaded from CDN (async)
- Fonts are loaded from Google Fonts (with display=swap)
- Component uses dynamic imports for Mermaid
- No significant performance impact expected

## Future Enhancements

- [ ] Add search/filter for nodes
- [ ] Add node sorting options
- [ ] Add print-friendly layout
- [ ] Add node animation on load
- [ ] Add keyboard navigation for nodes
- [ ] Add project comparison view
- [ ] Add PDF export of diagrams
- [ ] Add dark/light theme toggle

## Browser Support

- Chrome/Edge: ✓
- Firefox: ✓
- Safari: ✓
- Mobile browsers: ✓

---

For questions or issues, refer to the component code and Mermaid documentation:
- [Mermaid Docs](https://mermaid.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
