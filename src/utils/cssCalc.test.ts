import { describe, it, expect } from 'vitest'
import { evaluateCalc } from './cssCalc'

describe('evaluateCalc', () => {
  const mockContext = {
    parentWidth: 1000,
    parentHeight: 800,
    viewportWidth: 1920,
    viewportHeight: 1080,
  }

  describe('vh units', () => {
    it('should convert vh to pixels', () => {
      const result = evaluateCalc('50vh', mockContext)
      expect(result).toBe('540px')
    })

    it('should handle decimal vh values', () => {
      const result = evaluateCalc('33.33vh', mockContext)
      expect(result).toBe('359.964px')
    })

    it('should handle 100vh', () => {
      const result = evaluateCalc('100vh', mockContext)
      expect(result).toBe('1080px')
    })
  })

  describe('vw units', () => {
    it('should convert vw to pixels', () => {
      const result = evaluateCalc('50vw', mockContext)
      expect(result).toBe('960px')
    })

    it('should handle decimal vw values', () => {
      const result = evaluateCalc('25.5vw', mockContext)
      expect(result).toBe('489.6px')
    })

    it('should handle 100vw', () => {
      const result = evaluateCalc('100vw', mockContext)
      expect(result).toBe('1920px')
    })
  })

  describe('percentage units', () => {
    it('should convert percentage to pixels using parentHeight', () => {
      const result = evaluateCalc('50%', mockContext)
      expect(result).toBe('400px')
    })

    it('should handle decimal percentage values', () => {
      const result = evaluateCalc('33.33%', mockContext)
      expect(result).toBe('266.64px')
    })

    it('should return original value if no parentHeight provided', () => {
      const contextWithoutParent = {
        viewportWidth: 1920,
        viewportHeight: 1080,
      }
      const result = evaluateCalc('50%', contextWithoutParent)
      expect(result).toBe('50%')
    })
  })

  describe('px units', () => {
    it('should return px values as-is', () => {
      const result = evaluateCalc('500px', mockContext)
      expect(result).toBe('500px')
    })

    it('should handle decimal px values', () => {
      const result = evaluateCalc('123.45px', mockContext)
      expect(result).toBe('123.45px')
    })
  })

  describe('calc() expressions', () => {
    it('should evaluate calc with addition', () => {
      const result = evaluateCalc('calc(100px + 50px)', mockContext)
      expect(result).toBe('150px')
    })

    it('should evaluate calc with subtraction', () => {
      const result = evaluateCalc('calc(200px - 50px)', mockContext)
      expect(result).toBe('150px')
    })

    it('should evaluate calc with multiplication', () => {
      const result = evaluateCalc('calc(100px * 2)', mockContext)
      expect(result).toBe('200px')
    })

    it('should evaluate calc with division', () => {
      const result = evaluateCalc('calc(200px / 2)', mockContext)
      expect(result).toBe('100px')
    })

    it('should evaluate calc with vh units', () => {
      const result = evaluateCalc('calc(50vh + 100px)', mockContext)
      // 50vh = 540px, + 100px = 640px
      expect(result).toBe('640px')
    })

    it('should evaluate calc with vw units', () => {
      const result = evaluateCalc('calc(10vw - 50px)', mockContext)
      // 10vw = 192px, - 50px = 142px
      expect(result).toBe('142px')
    })

    it('should evaluate calc with percentage units', () => {
      const result = evaluateCalc('calc(50% + 100px)', mockContext)
      // 50% of 800 = 400px, + 100px = 500px
      expect(result).toBe('500px')
    })

    it('should evaluate calc with mixed units', () => {
      const result = evaluateCalc('calc(50vh + 10vw - 100px)', mockContext)
      // 50vh = 540px, 10vw = 192px, -100px
      // 540 + 192 - 100 = 632px
      expect(result).toBe('632px')
    })

    it('should handle complex calc expressions', () => {
      const result = evaluateCalc('calc((100vh - 200px) / 2)', mockContext)
      // 100vh = 1080px, -200px = 880px, /2 = 440px
      expect(result).toBe('440px')
    })

    it('should handle calc with spaces', () => {
      const result = evaluateCalc('calc( 100px + 50px )', mockContext)
      expect(result).toBe('150px')
    })

    it('should handle calc without spaces', () => {
      const result = evaluateCalc('calc(100px+50px)', mockContext)
      expect(result).toBe('150px')
    })
  })

  describe('edge cases', () => {
    it('should handle values with extra whitespace', () => {
      const result = evaluateCalc('  50vh  ', mockContext)
      expect(result).toBe('540px')
    })

    it('should return original value for unsupported formats', () => {
      const result = evaluateCalc('auto', mockContext)
      expect(result).toBe('auto')
    })

    it('should return original value for invalid calc expressions', () => {
      const result = evaluateCalc('calc(invalid)', mockContext)
      expect(result).toBe('calc(invalid)')
    })

    it('should handle 0 values', () => {
      const result = evaluateCalc('0px', mockContext)
      expect(result).toBe('0px')
    })

    it('should handle calc with 0', () => {
      const result = evaluateCalc('calc(0px + 100px)', mockContext)
      expect(result).toBe('100px')
    })
  })

  describe('real-world scenarios', () => {
    it('should handle typical ScrollHijack height calculation', () => {
      const result = evaluateCalc('150vh', mockContext)
      expect(result).toBe('1620px')
    })

    it('should handle typical Zoom magnificationPath', () => {
      const result = evaluateCalc('50vh', mockContext)
      expect(result).toBe('540px')
    })

    it('should handle viewport-based margins', () => {
      const result = evaluateCalc('calc(100vh - 80px)', mockContext)
      expect(result).toBe('1000px')
    })
  })
})
