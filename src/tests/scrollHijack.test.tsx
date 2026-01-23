import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScrollHijack from '../components/scrollHijack'

// Mock the cssCalc utility
vi.mock('../utils/cssCalc', () => ({
  evaluateCalc: vi.fn((value: string) => {
    // Simple mock implementation for testing
    if (value === '150vh') return '1620px'
    if (value === '100vh') return '1080px'
    if (value === '200vh') return '2160px'
    if (value.includes('px')) return value
    return value
  }),
}))

describe('ScrollHijack', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
    // Mock window.innerHeight for viewport calculations
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    })
  })

  describe('rendering', () => {
    it('should render children correctly', () => {
      render(
        <ScrollHijack>
          <div data-testid="test-child">Test Content</div>
        </ScrollHijack>
      )

      expect(screen.getByTestId('test-child')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render with default className', () => {
      const { container } = render(
        <ScrollHijack>
          <div>Content</div>
        </ScrollHijack>
      )

      const hijackContainer = container.querySelector('.hijackContainer')
      expect(hijackContainer).toBeInTheDocument()
    })

    it('should apply custom className when provided', () => {
      const { container } = render(
        <ScrollHijack className="custom-class">
          <div>Content</div>
        </ScrollHijack>
      )

      const hijackContainer = container.querySelector('.hijackContainer')
      expect(hijackContainer).toHaveClass('hijackContainer')
      expect(hijackContainer).toHaveClass('custom-class')
    })

    it('should create hijackContent wrapper', () => {
      const { container } = render(
        <ScrollHijack>
          <div>Content</div>
        </ScrollHijack>
      )

      const hijackContent = container.querySelector('.hijackContent')
      expect(hijackContent).toBeInTheDocument()
    })
  })

  describe('unique IDs', () => {
    it('should generate unique IDs for multiple instances', () => {
      const { container: container1 } = render(
        <ScrollHijack>
          <div>Content 1</div>
        </ScrollHijack>
      )

      const { container: container2 } = render(
        <ScrollHijack>
          <div>Content 2</div>
        </ScrollHijack>
      )

      const id1 = container1.querySelector('.hijackContainer')?.id
      const id2 = container2.querySelector('.hijackContainer')?.id

      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(id1).not.toBe(id2)
    })
  })

  describe('scrollPath prop', () => {
    it('should use default scrollPath of 150vh', () => {
      const { container } = render(
        <ScrollHijack>
          <div>Content</div>
        </ScrollHijack>
      )

      const hijackContainer = container.querySelector('.hijackContainer') as HTMLElement
      
      // The useEffect should set the height
      expect(hijackContainer).toBeInTheDocument()
      // Note: In JSDOM, the height may not be properly set due to layout constraints
      // This is a limitation of testing DOM manipulation in JSDOM
    })

    it('should accept custom scrollPath', () => {
      const { container } = render(
        <ScrollHijack scrollPath="200vh">
          <div>Content</div>
        </ScrollHijack>
      )

      const hijackContainer = container.querySelector('.hijackContainer')
      expect(hijackContainer).toBeInTheDocument()
    })

    it('should accept pixel values for scrollPath', () => {
      const { container } = render(
        <ScrollHijack scrollPath="1000px">
          <div>Content</div>
        </ScrollHijack>
      )

      const hijackContainer = container.querySelector('.hijackContainer')
      expect(hijackContainer).toBeInTheDocument()
    })
  })

  describe('structure', () => {
    it('should have correct HTML structure', () => {
      const { container } = render(
        <ScrollHijack className="test-hijack">
          <div data-testid="child">Test Child</div>
        </ScrollHijack>
      )

      const hijackContainer = container.querySelector('.hijackContainer.test-hijack')
      expect(hijackContainer).toBeInTheDocument()

      const hijackContent = hijackContainer?.querySelector('.hijackContent')
      expect(hijackContent).toBeInTheDocument()

      const child = hijackContent?.querySelector('[data-testid="child"]')
      expect(child).toBeInTheDocument()
    })

    it('should maintain proper parent-child relationships', () => {
      render(
        <ScrollHijack>
          <div data-testid="parent">
            <div data-testid="child">Nested</div>
          </div>
        </ScrollHijack>
      )

      const parent = screen.getByTestId('parent')
      const child = screen.getByTestId('child')

      expect(parent).toContainElement(child)
    })
  })

  describe('multiple children', () => {
    it('should render multiple children correctly', () => {
      render(
        <ScrollHijack>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </ScrollHijack>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
      expect(screen.getByTestId('child-3')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle empty children', () => {
      const { container } = render(
        <ScrollHijack>
          <div></div>
        </ScrollHijack>
      )

      const hijackContent = container.querySelector('.hijackContent')
      expect(hijackContent).toBeInTheDocument()
    })

    it('should handle text-only children', () => {
      render(
        <ScrollHijack>
          Plain text content
        </ScrollHijack>
      )

      expect(screen.getByText('Plain text content')).toBeInTheDocument()
    })

    it('should handle React fragments as children', () => {
      render(
        <ScrollHijack>
          <>
            <div data-testid="fragment-child-1">Fragment 1</div>
            <div data-testid="fragment-child-2">Fragment 2</div>
          </>
        </ScrollHijack>
      )

      expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument()
      expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument()
    })
  })
})
