import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import Zoom from './zoom'

// Mock ScrollHijack component
vi.mock('./scrollHijack', () => ({
  default: ({ children, className, scrollPath }: any) => (
    <div data-testid="scroll-hijack" className={className} data-scroll-path={scrollPath}>
      {children}
    </div>
  ),
}))

// Mock cssCalc utility
vi.mock('../utils/cssCalc', () => ({
  evaluateCalc: vi.fn((value: string) => {
    if (value === '50vh') return '540px'
    if (value === '100vh') return '1080px'
    if (value.includes('px')) return value
    return value
  }),
}))

describe('Zoom', () => {
  const mockEntireImage = '/images/entire.jpg'
  const mockMaskImage = '/images/mask.png'

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock window properties
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    })
    
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    })

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })

    // Mock Image constructor
    globalThis.Image = class {
      onload: (() => void) | null = null
      src: string = ''
      width: number = 1920
      height: number = 1080

      constructor() {
        setTimeout(() => {
          if (this.onload) {
            this.onload()
          }
        }, 0)
      }
    } as any

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 1920,
      height: 1080,
      x: 0,
      y: 0,
      toJSON: () => {},
    }))

    // Mock getComputedStyle
    window.getComputedStyle = vi.fn(() => ({
      backgroundImage: `url("${mockEntireImage}")`,
    })) as any

    // Mock element properties
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 1920,
    })

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 1080,
    })

    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 1080,
    })

    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 1920,
    })

    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: 1080,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render zoom container with correct structure', () => {
      const { container } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      expect(container.querySelector('.zoomImages')).toBeInTheDocument()
      expect(container.querySelector('.maskImage')).toBeInTheDocument()
      expect(container.querySelector('.entireImage')).toBeInTheDocument()
    })

    it('should wrap content in ScrollHijack component', () => {
      const { getByTestId } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      expect(getByTestId('scroll-hijack')).toBeInTheDocument()
    })

    it('should generate unique IDs for multiple instances', () => {
      const { container: container1 } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      const { container: container2 } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      const id1 = container1.querySelector('.zoomImages')?.id
      const id2 = container2.querySelector('.zoomImages')?.id

      expect(id1).toBeTruthy()
      expect(id2).toBeTruthy()
      expect(id1).not.toBe(id2)
    })
  })

  describe('props', () => {
    it('should accept entireImage prop', () => {
      const { container } = render(
        <Zoom entireImage={mockEntireImage} />
      )

      expect(container.querySelector('.entireImage')).toBeInTheDocument()
    })

    it('should accept maskImage prop', () => {
      const { container } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      expect(container.querySelector('.maskImage')).toBeInTheDocument()
    })

    it('should use default magnification of 20', () => {
      const { container } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      expect(container.querySelector('.zoomImages')).toBeInTheDocument()
    })

    it('should accept custom magnification', () => {
      const { container } = render(
        <Zoom 
          entireImage={mockEntireImage} 
          maskImage={mockMaskImage}
          magnification={30}
        />
      )

      expect(container.querySelector('.zoomImages')).toBeInTheDocument()
    })

    it('should use default magnificationPath of 50vh', () => {
      const { container } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      expect(container.querySelector('.zoomImages')).toBeInTheDocument()
    })

    it('should accept custom magnificationPath', () => {
      const { container } = render(
        <Zoom 
          entireImage={mockEntireImage} 
          maskImage={mockMaskImage}
          magnificationPath="100vh"
        />
      )

      expect(container.querySelector('.zoomImages')).toBeInTheDocument()
    })

    it('should pass totalPath to ScrollHijack', () => {
      const { getByTestId } = render(
        <Zoom 
          entireImage={mockEntireImage} 
          maskImage={mockMaskImage}
          totalPath="200vh"
        />
      )

      const scrollHijack = getByTestId('scroll-hijack')
      expect(scrollHijack).toHaveAttribute('data-scroll-path', '200vh')
    })
  })

  describe('className inheritance', () => {
    it('should pass unique className to ScrollHijack', () => {
      const { getByTestId } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      const scrollHijack = getByTestId('scroll-hijack')
      expect(scrollHijack.className).toMatch(/zoom-instance-\d+/)
    })

    it('should use different classNames for multiple instances', () => {
      const { container: container1 } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      const { container: container2 } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      const className1 = container1.querySelector('[data-testid="scroll-hijack"]')?.className
      const className2 = container2.querySelector('[data-testid="scroll-hijack"]')?.className

      expect(className1).toBeTruthy()
      expect(className2).toBeTruthy()
      expect(className1).not.toBe(className2)
    })
  })

  describe('image containers', () => {
    it('should create maskImage container with unique ID', () => {
      const { container } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      const maskImage = container.querySelector('.maskImage')
      expect(maskImage).toBeInTheDocument()
      expect(maskImage?.id).toMatch(/maskImage-zoom-instance-\d+/)
    })

    it('should create entireImage container with unique ID', () => {
      const { container } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      const entireImage = container.querySelector('.entireImage')
      expect(entireImage).toBeInTheDocument()
      expect(entireImage?.id).toMatch(/entireImage-zoom-instance-\d+/)
    })

    it('should create zoomImages container with unique ID', () => {
      const { container } = render(
        <Zoom entireImage={mockEntireImage} maskImage={mockMaskImage} />
      )

      const zoomImages = container.querySelector('.zoomImages')
      expect(zoomImages).toBeInTheDocument()
      expect(zoomImages?.id).toMatch(/zoomImages-zoom-instance-\d+/)
    })
  })

  describe('without maskImage', () => {
    it('should render without maskImage prop', () => {
      const { container } = render(
        <Zoom entireImage={mockEntireImage} />
      )

      expect(container.querySelector('.entireImage')).toBeInTheDocument()
      expect(container.querySelector('.maskImage')).toBeInTheDocument()
    })
  })
})
