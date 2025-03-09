import { describe, it, expect } from 'vitest';
import { transformAsyncComponents } from '../src/transform';

function normalizeString(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

describe('transformAsyncComponents', () => {
  it('should transform single async component import', () => {
    const code = `
      /* @async */
      import ComponentA from './index-a.vue';
      /* @endasync */
    `;
    const expected = `
      import { defineAsyncComponent } from 'vue';
      const ComponentA = defineAsyncComponent(() => import('./index-a.vue'));
    `;
    expect(normalizeString(transformAsyncComponents(code))).toBe(normalizeString(expected));
  });

  it('should transform multiple async component imports', () => {
    const code = `
      /* @async */
      import ComponentA from './index-a.vue';
      import ComponentB from './index-b.vue';
      /* @endasync */
    `;
    const expected = `
      import { defineAsyncComponent } from 'vue';
      const ComponentA = defineAsyncComponent(() => import('./index-a.vue'));
      const ComponentB = defineAsyncComponent(() => import('./index-b.vue'));
    `;
    expect(normalizeString(transformAsyncComponents(code))).toBe(normalizeString(expected));
  });

  it('should handle multiple async blocks and import defineAsyncComponent only once', () => {
    const code = `
      /* @async */
      import ComponentA from './index-a.vue';
      /* @endasync */
      const someCode = 'example';
      /* @async */
      import ComponentB from './index-b.vue';
      /* @endasync */
    `;
    const expected = `
      import { defineAsyncComponent } from 'vue';
      const ComponentA = defineAsyncComponent(() => import('./index-a.vue'));
      const someCode = 'example';
      const ComponentB = defineAsyncComponent(() => import('./index-b.vue'));
    `;
    expect(normalizeString(transformAsyncComponents(code))).toBe(normalizeString(expected));
  });

  it('should not transform code without async comments', () => {
    const code = `
      import ComponentA from './index-a.vue';
      const someCode = 'example';
    `;
    expect(normalizeString(transformAsyncComponents(code))).toBe(normalizeString(code));
  });
});