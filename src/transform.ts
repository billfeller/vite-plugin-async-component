import type { Plugin } from 'vite';

export function asyncComponentPlugin(): Plugin {
  return {
    name: 'vite-plugin-async-component',
    transform(code, id) {
      if (id.endsWith('.vue') || id.endsWith('.ts') || id.endsWith('.js')) {
        return transformAsyncComponents(code);
      }
      return code;
    },
  };
}

export function transformAsyncComponents(code: string): string {
  const asyncImportRegex = /\/\* @async \*\/([\s\S]*?)\/\* @endasync \*\//g;
  let match;
  let transformedCode = code;
  let hasAsyncComponentImport = false;
  let firstMatch = '';

  while ((match = asyncImportRegex.exec(code)) !== null) {
    const imports = match[1].trim().split('\n')
      .map(line => line.trim());
    const asyncImports = imports.map((importLine) => {
      const [, moduleName, modulePath] = /import (\w+) from '(.+)';/.exec(importLine) || [];
      return `const ${moduleName} = defineAsyncComponent(() => import('${modulePath}'));`;
    }).join('\n');

    transformedCode = transformedCode.replace(match[0], asyncImports);
    hasAsyncComponentImport = true;
    if (!firstMatch) {
      firstMatch = asyncImports;
    }
  }

  if (hasAsyncComponentImport) {
    transformedCode = transformedCode.replace(firstMatch, `import { defineAsyncComponent } from 'vue';\n${firstMatch}`);
  }

  return transformedCode;
}
