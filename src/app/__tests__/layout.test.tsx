import { render } from '@testing-library/react';
import RootLayout from '../layout';

// Mock the Geist fonts
jest.mock('next/font/google', () => ({
  Geist: () => ({
    variable: '--font-geist-sans',
  }),
  Geist_Mono: () => ({
    variable: '--font-geist-mono',
  }),
}));

describe('RootLayout', () => {
  let originalConsoleError: typeof console.error;

  beforeAll(() => {
    // Save original console.error
    originalConsoleError = console.error;

    // Suppress specific error about <html> being a child of <div> which is expected
    // when using React Testing Library to test a full HTML document layout
    console.error = (...args: unknown[]) => {
      // Check if it's the specific hydration warning string
      if (typeof args[0] === 'string' && args[0].includes('hydration error')) {
        return;
      }
      if (typeof args[0] === 'string' && args[0].includes('In HTML')) {
        return;
      }
      originalConsoleError(...args);
    };
  });

  afterAll(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('renders children within HTML and body tags', () => {
    // When testing components that render <html> and <body>,
    // we need to tell React Testing Library to use a document
    // fragment or null container instead of the default <div>
    //
    // We can just query document.body or document.documentElement directly
    // after rendering because React will mount the <html> element to the jsdom document
    render(
      <RootLayout>
        <div data-testid="child-element">Test Child</div>
      </RootLayout>
    );

    // Assert that the child is rendered
    expect(document.querySelector('[data-testid="child-element"]')).toBeInTheDocument();

    // Check if body tag has the correct classes
    const body = document.querySelector('body');
    expect(body).toBeInTheDocument();
    expect(body).toHaveClass('min-h-full');
    expect(body).toHaveClass('flex');
    expect(body).toHaveClass('flex-col');

    // Check html tag classes
    const html = document.querySelector('html');
    expect(html).toBeInTheDocument();
    expect(html).toHaveAttribute('lang', 'en');
    expect(html).toHaveClass('--font-geist-sans');
    expect(html).toHaveClass('--font-geist-mono');
    expect(html).toHaveClass('h-full');
    expect(html).toHaveClass('antialiased');
  });
});
