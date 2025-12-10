import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MainContent } from '../main-content';

// Mock the child components
vi.mock('@/components/chat/ChatInterface', () => ({
  ChatInterface: () => <div>ChatInterface Mock</div>,
}));

vi.mock('@/components/preview/PreviewFrame', () => ({
  PreviewFrame: () => <div>PreviewFrame Mock</div>,
}));

vi.mock('@/components/editor/FileTree', () => ({
  FileTree: () => <div>FileTree Mock</div>,
}));

vi.mock('@/components/editor/CodeEditor', () => ({
  CodeEditor: () => <div>CodeEditor Mock</div>,
}));

vi.mock('@/components/HeaderActions', () => ({
  HeaderActions: () => <div>HeaderActions Mock</div>,
}));

vi.mock('@/lib/contexts/file-system-context', () => ({
  FileSystemProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/lib/contexts/chat-context', () => ({
  ChatProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('MainContent Toggle Buttons', () => {
  it('should toggle between preview and code views when clicking tabs', () => {
    render(<MainContent user={null} project={undefined} />);

    // Find the Preview and Code buttons
    const previewButton = screen.getByRole('tab', { name: /preview/i });
    const codeButton = screen.getByRole('tab', { name: /code/i });

    // Initially, Preview should be active
    expect(previewButton).toHaveAttribute('data-state', 'active');
    expect(codeButton).toHaveAttribute('data-state', 'inactive');

    // Preview content should be visible
    expect(screen.getByText('PreviewFrame Mock')).toBeInTheDocument();
    expect(screen.queryByText('FileTree Mock')).not.toBeInTheDocument();
    expect(screen.queryByText('CodeEditor Mock')).not.toBeInTheDocument();

    // Click Code button
    fireEvent.click(codeButton);

    // Code should now be active
    expect(codeButton).toHaveAttribute('data-state', 'active');
    expect(previewButton).toHaveAttribute('data-state', 'inactive');

    // Code content should be visible
    expect(screen.queryByText('PreviewFrame Mock')).not.toBeInTheDocument();
    expect(screen.getByText('FileTree Mock')).toBeInTheDocument();
    expect(screen.getByText('CodeEditor Mock')).toBeInTheDocument();

    // Click Preview button again
    fireEvent.click(previewButton);

    // Preview should be active again
    expect(previewButton).toHaveAttribute('data-state', 'active');
    expect(codeButton).toHaveAttribute('data-state', 'inactive');

    // Preview content should be visible again
    expect(screen.getByText('PreviewFrame Mock')).toBeInTheDocument();
    expect(screen.queryByText('FileTree Mock')).not.toBeInTheDocument();
    expect(screen.queryByText('CodeEditor Mock')).not.toBeInTheDocument();
  });

  it('should handle rapid toggling between tabs', () => {
    render(<MainContent user={null} project={undefined} />);

    const previewButton = screen.getByRole('tab', { name: /preview/i });
    const codeButton = screen.getByRole('tab', { name: /code/i });

    // Rapidly toggle multiple times
    fireEvent.click(codeButton);
    fireEvent.click(previewButton);
    fireEvent.click(codeButton);
    fireEvent.click(previewButton);
    fireEvent.click(codeButton);

    // Should end on code view
    expect(codeButton).toHaveAttribute('data-state', 'active');
    expect(screen.getByText('CodeEditor Mock')).toBeInTheDocument();
  });
});
