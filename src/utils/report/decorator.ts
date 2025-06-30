import { test } from '@playwright/test';

import { maskSensitiveData } from '../security/maskingUtils';
import { sensitiveSelectors } from '../security/sensitiveData';

/**
 * Decorator that wraps a step method with a Playwright test step.
 * Used for reporting purposes.
 *
 * @example
 ```
    import { step } from './step_decorator';
    class MyTestClass {
        @step('optional step name')
        async myTestFunction() {
            // Test code goes here
        }
    }
 ```
 */
export function logStep<This, Args extends any[], Return>(message?: string) {
  return function actualDecorator(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
  ) {
    function replacementMethod(this: any, ...args: Args) {
      const name = message ?? `${this.constructor.name}.${context.name as string}`;
      return test.step(name, async () => target.call(this, ...args), { box: false });
    }
    return replacementMethod;
  };
}

export function logAction<This, Args extends any[], Return>(stepTemplate: string) {
  return function actualDecorator(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
  ) {
    function replacementMethod(this: This, ...args: Args): Promise<Return> {
      const selector = args[0];
      let value = args[1];
      if (typeof value === 'string' && sensitiveSelectors.includes(selector)) {
        value = maskSensitiveData(value);
      }

      let stepName = stepTemplate;
      if (stepTemplate.includes('{selector}')) {
        stepName = stepName.replace('{selector}', `"${args[0]}"`);
      }
      if (stepTemplate.includes('{text}') && args.length > 1) {
        stepName = stepName.replace('{text}', `"${value}"`);
      }

      return test.step(stepName, async () => target.call(this, ...args), { box: false });
    }

    return replacementMethod;
  };
}
