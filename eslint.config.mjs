import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // 번들 크기를 되돌리는 import 를 막는다. 둘 다 어겨도 동작은 하거나(zod) 런타임에서야 드러난다(motion).
      // no-restricted-imports 는 권장 형태인 `import * as z` 까지 막아서, 막을 모양만 골라 지정한다.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ImportDeclaration[source.value='framer-motion'] > ImportSpecifier[imported.name='motion']",
          message:
            "m 컴포넌트(m.div 등)를 쓰세요. 루트 LazyMotion 이 strict 라 motion 컴포넌트는 런타임 오류가 나고, 애니메이션 기능 전체(약 140KB)를 번들에 싣습니다.",
        },
        {
          selector:
            "ImportDeclaration[source.value='zod'] > :matches(ImportDefaultSpecifier, ImportSpecifier[imported.name='z'])",
          message:
            'import * as z from "zod" 로 가져오세요. z 객체를 통째로 가져오면 zod 오류 번역 40여 개 언어(약 150KB)가 번들에 실립니다.',
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
