/**
 * Node's ESM loader requires a file extension on relative imports; the app itself
 * is bundled by Vite, which does not. This hook retries a failed relative
 * specifier with `.ts` appended so `node --test` can load the source tree as-is.
 *
 * Used only by `npm test` (see package.json).
 */
import { registerHooks } from 'node:module';

const HAS_EXTENSION = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|json|css)$/;

registerHooks({
    resolve(specifier, context, nextResolve) {
        if (specifier.startsWith('.') && !HAS_EXTENSION.test(specifier)) {
            try {
                return nextResolve(`${specifier}.ts`, context);
            } catch {
                // fall through to the original specifier so the real error surfaces
            }
        }
        return nextResolve(specifier, context);
    },
});
