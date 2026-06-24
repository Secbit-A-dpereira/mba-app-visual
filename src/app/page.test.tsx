import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Home from './page';
import React from 'react';

// Mock context to avoid complex state setups in the root test
vi.mock('@/context/MBAContext', () => ({
  MBAProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="mba-provider">{children}</div>,
  useMBA: () => ({
    resetToExample: vi.fn(),
    resetToBlank: vi.fn(),
    isBlank: false,
  }),
}));

// Mock chapters and dashboard to isolate the shell/layout testing
vi.mock('@/components/chapters/ChapterView', () => ({
  default: ({ chapterId }: { chapterId: number }) => <div data-testid="chapter-view">Chapter {chapterId}</div>,
}));

vi.mock('@/components/chapters/Ch20Dashboard', () => ({
  default: () => <div data-testid="dashboard-view">Dashboard Content</div>,
}));

test('Home component renders without crashing', () => {
  render(<Home />);
  expect(screen.getByTestId('mba-provider')).toBeInTheDocument();
  expect(screen.getByTestId('dashboard-view')).toBeInTheDocument();
  expect(screen.getByText('The Visual MBA')).toBeInTheDocument();
});

test('Navigation changes view from Dashboard to Chapter', () => {
  render(<Home />);
  expect(screen.getByTestId('dashboard-view')).toBeInTheDocument();

  const chapter1Link = screen.getByText('Ch.1 Leadership');
  fireEvent.click(chapter1Link);

  expect(screen.queryByTestId('dashboard-view')).not.toBeInTheDocument();
  expect(screen.getByTestId('chapter-view')).toBeInTheDocument();
  expect(screen.getByTestId('chapter-view')).toHaveTextContent('Chapter 1');
});

test('Dark mode toggle works', () => {
  const { container } = render(<Home />);
  const toggleButton = screen.getByLabelText('Toggle Dark Mode');

  expect(screen.getByText('☀️')).toBeInTheDocument();

  const darkModeWrapper = container.querySelector('.dark');
  expect(darkModeWrapper).toBeInTheDocument();

  fireEvent.click(toggleButton);

  expect(screen.getByText('🌙')).toBeInTheDocument();
  expect(container.querySelector('.dark')).not.toBeInTheDocument();
});

test('Sidebar toggle works', () => {
  const { container } = render(<Home />);

  let sidebar = screen.getByText('Executive Toolkit').closest('aside');
  expect(sidebar).toHaveClass('translate-x-0');

  // Find the sidebar open button inside header
  const headerMenuButton = container.querySelector('header button');
  if (headerMenuButton) {
    fireEvent.click(headerMenuButton);
    // Grab the new DOM element in case it was recreated, although React usually mutates the same node
    sidebar = screen.getByText('Executive Toolkit').closest('aside');
    expect(sidebar).toHaveClass('-translate-x-full');
  } else {
    throw new Error('Menu button not found');
  }
});
