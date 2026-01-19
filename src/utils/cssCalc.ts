/**
 * Converts CSS values (vh, vw, %, calc) to pixel values
 * Supports vh, vw, px, %, and calc() with arithmetic operations
 */
export function evaluateCalc(value: string, context: {
    parentWidth?: number;
    parentHeight?: number;
    viewportWidth: number;
    viewportHeight: number;
}): string {
    let processedValue = value.trim();

    // Handle calc() expressions
    if (processedValue.includes('calc(')) {
        const calcMatch = processedValue.match(/calc\((.*)\)/);
        if (!calcMatch) return value;

        let expression = calcMatch[1];

        // Replace viewport units
        expression = expression.replace(/(\d+(?:\.\d+)?)\s*vh/g, (_, num) => {
            return String(parseFloat(num) * context.viewportHeight / 100);
        });

        expression = expression.replace(/(\d+(?:\.\d+)?)\s*vw/g, (_, num) => {
            return String(parseFloat(num) * context.viewportWidth / 100);
        });

        // Replace percentage units (relative to parent height for height property)
        if (context.parentHeight) {
            expression = expression.replace(/(\d+(?:\.\d+)?)\s*%/g, (_, num) => {
                return String(parseFloat(num) * context.parentHeight! / 100);
            });
        }

        // Remove 'px' units for calculation
        expression = expression.replace(/px/g, '');

        // Clean up whitespace
        expression = expression.trim();

        try {
            // Safely evaluate the mathematical expression
            const result = Function('"use strict"; return (' + expression + ')')();
            return `${result}px`;
        } catch (error) {
            console.error('Failed to evaluate calc expression:', expression, error);
            return value;
        }
    }

    // Handle standalone vh values
    const vhMatch = processedValue.match(/^(\d+(?:\.\d+)?)\s*vh$/);
    if (vhMatch) {
        const pixels = parseFloat(vhMatch[1]) * context.viewportHeight / 100;
        return `${pixels}px`;
    }

    // Handle standalone vw values
    const vwMatch = processedValue.match(/^(\d+(?:\.\d+)?)\s*vw$/);
    if (vwMatch) {
        const pixels = parseFloat(vwMatch[1]) * context.viewportWidth / 100;
        return `${pixels}px`;
    }

    // Handle standalone percentage values
    const percentMatch = processedValue.match(/^(\d+(?:\.\d+)?)\s*%$/);
    if (percentMatch && context.parentHeight) {
        const pixels = parseFloat(percentMatch[1]) * context.parentHeight / 100;
        return `${pixels}px`;
    }

    // If already in pixels or other format, return as is
    return value;
}
