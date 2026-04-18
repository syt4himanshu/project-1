# AI Remarks Assistant - Design Specification

## Visual Design System

### Color Palette

#### Primary Colors
```css
--ai-primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--ai-success-gradient: linear-gradient(135deg, #10b981 0%, #059669 100%)
--ai-background: #ffffff
--ai-surface: #fafafa
```

#### Semantic Colors
```css
--ai-text-primary: #1f2937
--ai-text-secondary: #6b7280
--ai-border: #e5e7eb
--ai-border-focus: #667eea
--ai-error-bg: #fef2f2
--ai-error-border: #fecaca
--ai-error-text: #dc2626
```

#### Dark Mode
```css
--ai-background-dark: #1f2937
--ai-surface-dark: #111827
--ai-text-primary-dark: #f3f4f6
--ai-text-secondary-dark: #9ca3af
--ai-border-dark: #374151
```

### Typography

#### Font Families
- **Primary**: system-ui, 'Segoe UI', Roboto, sans-serif
- **Monospace**: ui-monospace, Consolas, monospace

#### Font Sizes
```css
--ai-text-xs: 0.8125rem (13px)
--ai-text-sm: 0.875rem (14px)
--ai-text-base: 0.9375rem (15px)
--ai-text-lg: 1rem (16px)
--ai-text-xl: 1.75rem (28px)
```

#### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600

### Spacing System

```css
--ai-space-xs: 0.25rem (4px)
--ai-space-sm: 0.5rem (8px)
--ai-space-md: 0.75rem (12px)
--ai-space-lg: 1rem (16px)
--ai-space-xl: 1.25rem (20px)
--ai-space-2xl: 1.5rem (24px)
```

### Border Radius

```css
--ai-radius-sm: 8px
--ai-radius-md: 12px
--ai-radius-lg: 16px
--ai-radius-xl: 20px
--ai-radius-full: 50%
```

### Shadows

```css
--ai-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--ai-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--ai-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
--ai-shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1)
--ai-shadow-focus: 0 0 0 3px rgba(102, 126, 234, 0.1)
--ai-shadow-button: 0 4px 12px rgba(102, 126, 234, 0.4)
```

## Component Anatomy

### 1. Popup Container

```
┌─────────────────────────────────────┐
│  Header (Gradient)                  │
├─────────────────────────────────────┤
│  Suggestion Chips (Horizontal)      │
├─────────────────────────────────────┤
│                                     │
│  Messages Area (Scrollable)         │
│                                     │
│  - Assistant messages (left)        │
│  - User messages (right)            │
│                                     │
├─────────────────────────────────────┤
│  Input + Send Button                │
├─────────────────────────────────────┤
│  Insert Button (when ready)         │
└─────────────────────────────────────┘
```

**Dimensions**:
- Max Width: 480px
- Max Height: 85vh
- Padding: 1.5rem (24px)
- Border Radius: 16px

### 2. Header Section

**Layout**:
```
┌─────────────────────────────────────┐
│ ✨ AI Remarks Assistant          × │
│    John Doe • Sem 4 • CS            │
└─────────────────────────────────────┘
```

**Styling**:
- Background: Purple gradient
- Color: White
- Padding: 1.25rem 1.5rem
- Icon: Sparkles (animated pulse)
- Close button: 32×32px, rounded

### 3. Suggestion Chips

**Layout**:
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 📊 Performance│ │ 🎯 Behavior  │ │ 📈 Improvement│
└──────────────┘ └──────────────┘ └──────────────┘
```

**Styling**:
- Background: #f3f4f6
- Border: 1px solid #e5e7eb
- Border Radius: 20px (pill shape)
- Padding: 0.5rem 0.875rem
- Font Size: 13px
- Hover: Lift effect (translateY(-1px))

### 4. Message Bubbles

**User Message** (Right-aligned):
```
                    ┌─────────────────┐
                    │ Generate feedback│
                    └─────────────────┘
```
- Background: Purple gradient
- Color: White
- Border Radius: 12px (bottom-right: 4px)
- Max Width: 85%
- Padding: 0.75rem 1rem

**Assistant Message** (Left-aligned):
```
┌─────────────────────────────────┐
│ Here's the performance feedback:│
│ Student shows consistent...     │
└─────────────────────────────────┘
```
- Background: #f3f4f6
- Color: #1f2937
- Border Radius: 12px (bottom-left: 4px)
- Max Width: 85%
- Padding: 0.75rem 1rem

### 5. Input Section

**Layout**:
```
┌─────────────────────────────────┐ ┌──┐
│ Ask for specific feedback...    │ │➤ │
└─────────────────────────────────┘ └──┘
```

**Styling**:
- Input Background: White
- Border: 1px solid #d1d5db
- Border Radius: 20px (pill)
- Padding: 0.625rem 1rem
- Send Button: 40×40px circle, gradient

### 6. Insert Button

**Layout**:
```
┌─────────────────────────────────────┐
│  ✓ Insert into Remarks Form         │
└─────────────────────────────────────┘
```

**Styling**:
- Background: Green gradient
- Color: White
- Border Radius: 10px
- Padding: 0.75rem 1.5rem
- Full Width
- Hover: Lift + shadow

## Interaction States

### Button States

#### Default
```css
background: gradient
opacity: 1
transform: none
```

#### Hover
```css
transform: translateY(-2px)
box-shadow: 0 8px 16px rgba(...)
```

#### Active
```css
transform: translateY(0)
box-shadow: 0 4px 8px rgba(...)
```

#### Disabled
```css
opacity: 0.5
cursor: not-allowed
pointer-events: none
```

### Input States

#### Default
```css
border: 1px solid #d1d5db
background: white
```

#### Focus
```css
border: 1px solid #667eea
box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1)
outline: none
```

#### Disabled
```css
background: #f3f4f6
cursor: not-allowed
```

## Animations

### Popup Entry
```css
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
duration: 200ms
easing: ease-out
```

### Message Entry
```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
duration: 200ms
easing: ease-out
```

### Loading Spinner
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
duration: 1s
easing: linear
iteration: infinite
```

### Sparkle Icon
```css
@keyframes sparkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
duration: 2s
easing: ease-in-out
iteration: infinite
```

## Responsive Breakpoints

### Desktop (>640px)
- Max Width: 480px
- Padding: 1.5rem
- Font Size: Base

### Mobile (≤640px)
- Max Width: 100%
- Padding: 1.25rem
- Font Size: Slightly reduced
- Border Radius: 12px

## Accessibility Requirements

### Keyboard Navigation
- **Tab**: Navigate between interactive elements
- **Enter**: Submit message / activate button
- **Escape**: Close popup
- **Arrow Keys**: Navigate chips (optional)

### Focus Indicators
```css
:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
```

### ARIA Attributes
```html
<div role="dialog" aria-modal="true" aria-labelledby="ai-remarks-title">
<button aria-label="Close AI assistant">
<input aria-label="Message input">
```

### Screen Reader Announcements
- "AI assistant opened"
- "Message sent"
- "AI is generating response"
- "Response received"
- "Content inserted"

## Icon System

### Icons Used (lucide-react)
- **Sparkles**: AI branding
- **Send**: Submit message
- **Loader2**: Loading state
- **AlertCircle**: Error state
- **CheckCircle2**: Success/Insert

### Icon Sizes
- Small: 16px
- Medium: 18px
- Large: 20px

## Loading States

### Message Loading
```
┌─────────────────────────────────┐
│ ⟳ Generating remarks...         │
└─────────────────────────────────┘
```
- Spinner icon (rotating)
- Italic text
- Reduced opacity (0.8)

### Button Loading
```
┌─────────────────────────────────┐
│  ⟳ Submitting...                │
└─────────────────────────────────┘
```
- Disabled state
- Loading text
- Spinner icon

## Error States

### API Error
```
┌─────────────────────────────────┐
│ ⚠ Failed to get AI response     │
└─────────────────────────────────┘
```
- Red background (#fef2f2)
- Red border (#fecaca)
- Red text (#dc2626)
- Alert icon

### Validation Error
```
Input: [Query is required]
```
- Red border on input
- Error text below

## Empty States

### No Messages
```
┌─────────────────────────────────┐
│ Hi! I'm here to help you write  │
│ remarks for John Doe. Choose a  │
│ suggestion below or ask me...   │
└─────────────────────────────────┘
```
- Friendly greeting
- Clear instructions
- Welcoming tone

## Dark Mode Adaptations

### Color Adjustments
- Background: #1f2937 → #111827
- Surface: #fafafa → #374151
- Text: #1f2937 → #f3f4f6
- Border: #e5e7eb → #4b5563

### Contrast Ratios
- Text: 4.5:1 minimum
- Interactive: 3:1 minimum
- Gradients: Maintain visibility

## Performance Considerations

### CSS Optimizations
- Use `transform` for animations (GPU)
- Avoid `box-shadow` animations
- Use `will-change` sparingly
- Minimize repaints

### Bundle Size
- Component: ~8KB
- CSS: ~7KB
- Total (gzipped): ~15KB

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Design Principles Summary

1. **Minimal**: No unnecessary elements
2. **Modern**: Gradients, shadows, rounded corners
3. **Fast**: <30 seconds per student
4. **Clear**: Obvious hierarchy and flow
5. **Accessible**: WCAG AA compliant
6. **Responsive**: Works on all devices
7. **Delightful**: Smooth animations, friendly tone
