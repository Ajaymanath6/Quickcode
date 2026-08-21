/**
 * @type {import('tailwindcss').Config}
 *
 * Icons: use Remix Icon for React (`@remixicon/react`).
 * Theme tokens: brandcolor-* utilities map to RGB CSS vars on :root (see src/index.css).
 * Rules for AI / designers: src/config/theme-guide.json
 */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,json}',
    './public/blueprints/**/*.json',
  ],
  safelist: [
    {
      pattern:
        /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-(micro|tight|cozy|section|hero|inline)$/,
    },
    {
      pattern:
        /^(gap|space-x|space-y)-(micro|tight|cozy|section|hero|inline)$/,
    },
    {
      pattern:
        /^(p|px|py|pt|pb|pl|pr)-(card-pad-compact|card-pad-default|card-pad-comfy)$/,
    },
    {
      pattern:
        /^gap-(card-gap-tight|card-gap-default|card-gap-loose)$/,
    },
    {
      pattern:
        /^space-[xy]-(card-gap-tight|card-gap-default|card-gap-loose)$/,
    },
  ],
  theme: {
    extend: {
      screens: {
        c_md: '768px',
        c_xl: '1280px',
        'md-page': '768px',
      },
      fontFamily: {
        sans: ['var(--font-sans-stack)'],
        lato: ['var(--font-sans-stack)'],
        catamaran: ['var(--font-catamaran-stack)'],
        lora: ['var(--font-lora-stack)'],
        geist: ['var(--font-geist-stack)'],
        // Catamaran: main headings above 32px
        'landing-heading': ['var(--font-catamaran-stack)'],
        // Lato: body and headings at or below 32px
        'landing-body': ['var(--font-sans-stack)'],
      },
      fontSize: {
        'canvas-ui': ['11px', { lineHeight: '14px' }],
        'canvas-xs': ['10px', { lineHeight: '12px' }],
        'theme-title-h1': [
          'var(--fs-theme-title-h1)',
          { lineHeight: 'var(--lh-theme-title-h1)' },
        ],
        'theme-title-h2': [
          'var(--fs-theme-title-h2)',
          { lineHeight: 'var(--lh-theme-title-h2)' },
        ],
        'theme-title-h3': [
          'var(--fs-theme-title-h3)',
          { lineHeight: 'var(--lh-theme-title-h3)' },
        ],
        'theme-title-h4': [
          'var(--fs-theme-title-h4)',
          { lineHeight: 'var(--lh-theme-title-h4)' },
        ],
        'theme-title-h5': [
          'var(--fs-theme-title-h5)',
          { lineHeight: 'var(--lh-theme-title-h5)' },
        ],
        'theme-title-h6': [
          'var(--fs-theme-title-h6)',
          { lineHeight: 'var(--lh-theme-title-h6)' },
        ],
        'theme-body-large-regular': [
          'var(--fs-theme-body-large-regular)',
          { lineHeight: 'var(--lh-theme-body-large-regular)' },
        ],
        'theme-body-large-emphasis': [
          'var(--fs-theme-body-large-emphasis)',
          { lineHeight: 'var(--lh-theme-body-large-emphasis)' },
        ],
        'theme-body-large-bold': [
          'var(--fs-theme-body-large-bold)',
          { lineHeight: 'var(--lh-theme-body-large-bold)' },
        ],
        'theme-body-medium-regular': [
          'var(--fs-theme-body-medium-regular)',
          { lineHeight: 'var(--lh-theme-body-medium-regular)' },
        ],
        'theme-body-medium-emphasis': [
          'var(--fs-theme-body-medium-emphasis)',
          { lineHeight: 'var(--lh-theme-body-medium-emphasis)' },
        ],
        'theme-body-medium-bold': [
          'var(--fs-theme-body-medium-bold)',
          { lineHeight: 'var(--lh-theme-body-medium-bold)' },
        ],
        'theme-body-small-regular': [
          'var(--fs-theme-body-small-regular)',
          { lineHeight: 'var(--lh-theme-body-small-regular)' },
        ],
        'theme-body-small-emphasis': [
          'var(--fs-theme-body-small-emphasis)',
          { lineHeight: 'var(--lh-theme-body-small-emphasis)' },
        ],
        'theme-body-small-bold': [
          'var(--fs-theme-body-small-bold)',
          { lineHeight: 'var(--lh-theme-body-small-bold)' },
        ],
      },
      lineHeight: {
        'theme-title-h1': 'var(--lh-theme-title-h1)',
        'theme-title-h2': 'var(--lh-theme-title-h2)',
        'theme-title-h3': 'var(--lh-theme-title-h3)',
        'theme-title-h4': 'var(--lh-theme-title-h4)',
        'theme-title-h5': 'var(--lh-theme-title-h5)',
        'theme-title-h6': 'var(--lh-theme-title-h6)',
        'theme-body-large-regular': 'var(--lh-theme-body-large-regular)',
        'theme-body-large-emphasis': 'var(--lh-theme-body-large-emphasis)',
        'theme-body-large-bold': 'var(--lh-theme-body-large-bold)',
        'theme-body-medium-regular': 'var(--lh-theme-body-medium-regular)',
        'theme-body-medium-emphasis': 'var(--lh-theme-body-medium-emphasis)',
        'theme-body-medium-bold': 'var(--lh-theme-body-medium-bold)',
        'theme-body-small-regular': 'var(--lh-theme-body-small-regular)',
        'theme-body-small-emphasis': 'var(--lh-theme-body-small-emphasis)',
        'theme-body-small-bold': 'var(--lh-theme-body-small-bold)',
      },
      fontWeight: {
        'theme-regular': 'var(--fw-theme-regular)',
        'theme-medium': 'var(--fw-theme-medium)',
        'theme-semibold': 'var(--fw-theme-semibold)',
        'theme-bold': 'var(--fw-theme-bold)',
      },
      colors: {
        'brandcolor-primary':
          'rgb(var(--color-brandcolor-primary) / <alpha-value>)',
        'brandcolor-primaryhover':
          'rgb(var(--color-brandcolor-primaryhover) / <alpha-value>)',
        'brandcolor-secondary':
          'rgb(var(--color-brandcolor-secondary) / <alpha-value>)',
        'brandcolor-secondaryhover':
          'rgb(var(--color-brandcolor-secondaryhover) / <alpha-value>)',
        'brandcolor-secondaryfill':
          'rgb(var(--color-brandcolor-secondaryfill) / <alpha-value>)',
        'brandcolor-neutralhover':
          'rgb(var(--color-brandcolor-neutralhover) / <alpha-value>)',
        'brandcolor-textstrong':
          'rgb(var(--color-brandcolor-textstrong) / <alpha-value>)',
        'brandcolor-textweak':
          'rgb(var(--color-brandcolor-textweak) / <alpha-value>)',
        'brandcolor-strokestrong':
          'rgb(var(--color-brandcolor-strokestrong) / <alpha-value>)',
        'brandcolor-strokeweak':
          'rgb(var(--color-brandcolor-strokeweak) / <alpha-value>)',
        'brandcolor-strokemild':
          'rgb(var(--color-brandcolor-strokemild) / <alpha-value>)',
        'brandcolor-strokelight':
          'rgb(var(--color-brandcolor-strokelight) / <alpha-value>)',
        'brandcolor-fill':
          'rgb(var(--color-brandcolor-fill) / <alpha-value>)',
        'brandcolor-white':
          'rgb(var(--color-brandcolor-white) / <alpha-value>)',
        'brandcolor-sidebarhover':
          'rgb(var(--color-brandcolor-sidebarhover) / <alpha-value>)',
        'brandcolor-divider':
          'rgb(var(--color-brandcolor-divider) / <alpha-value>)',
        'brandcolor-banner-info-bg':
          'rgb(var(--color-brandcolor-banner-info-bg) / <alpha-value>)',
        'brandcolor-banner-warning-bg':
          'rgb(var(--color-brandcolor-banner-warning-bg) / <alpha-value>)',
        'brandcolor-banner-warning-button':
          'rgb(var(--color-brandcolor-banner-warning-button) / <alpha-value>)',
        'brandcolor-results-bg':
          'rgb(var(--color-brandcolor-results-bg) / <alpha-value>)',
        'brandcolor-archived-bg':
          'rgb(var(--color-brandcolor-archived-bg) / <alpha-value>)',
        'brandcolor-archived-border':
          'rgb(var(--color-brandcolor-archived-border) / <alpha-value>)',
        'brandcolor-archived-badge':
          'rgb(var(--color-brandcolor-archived-badge) / <alpha-value>)',
        'brandcolor-destructive':
          'rgb(var(--color-brandcolor-destructive) / <alpha-value>)',
        'brandcolor-table-header':
          'rgb(var(--color-brandcolor-table-header) / <alpha-value>)',
        'brandcolor-badge-success-bg':
          'rgb(var(--color-brandcolor-badge-success-bg) / <alpha-value>)',
        'brandcolor-badge-success-text':
          'rgb(var(--color-brandcolor-badge-success-text) / <alpha-value>)',
        'brandcolor-badge-attorney-bg':
          'rgb(var(--color-brandcolor-badge-attorney-bg) / <alpha-value>)',
        'brandcolor-badge-attorney-text':
          'rgb(var(--color-brandcolor-badge-attorney-text) / <alpha-value>)',
        'brandcolor-badge-amber-bg':
          'rgb(var(--color-brandcolor-badge-amber-bg) / <alpha-value>)',
        'brandcolor-badge-amber-text':
          'rgb(var(--color-brandcolor-badge-amber-text) / <alpha-value>)',
      },
      boxShadow: {
        token: 'var(--shadow-md)',
        'button-press': 'var(--shadow-button-press)',
        'border-inset-strokelight': 'var(--shadow-border-inset-strokelight)',
        'border-inset-secondary': 'var(--shadow-border-inset-secondary)',
        'border-inset-secondary-press':
          'var(--shadow-border-inset-secondary-press)',
        header: 'var(--shadow-header)',
        'tab-option': 'var(--shadow-tab-option)',
        card: 'var(--shadow-card)',
        'sidebar-toggle': 'var(--shadow-sidebar-toggle)',
        'confirm-password-valid': 'var(--shadow-confirm-password-valid)',
        'button-brand-glow': 'var(--shadow-button-brand-glow)',
      },
      spacing: {
        token: 'var(--space-4)',
        micro: 'var(--space-micro)',
        tight: 'var(--space-tight)',
        cozy: 'var(--space-cozy)',
        section: 'var(--space-section)',
        hero: 'var(--space-hero)',
        inline: 'var(--space-inline)',
        'card-pad-compact': 'var(--card-padding-compact)',
        'card-pad-default': 'var(--card-padding-default)',
        'card-pad-comfy': 'var(--card-padding-comfy)',
        'card-gap-tight': 'var(--card-gap-tight)',
        'card-gap-default': 'var(--card-gap-default)',
        'card-gap-loose': 'var(--card-gap-loose)',
      },
      borderWidth: {
        1.5: '1.5px',
      },
      borderRadius: {
        button: '6px',
        large: '12px',
      },
    },
  },
  plugins: [],
}
