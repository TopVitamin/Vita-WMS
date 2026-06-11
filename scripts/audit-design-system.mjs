import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const scanRoots = ["src/app/pages", "src/app/components/business", "src/app/components/layouts", "src/app/components/wms"];
const extensions = new Set([".ts", ".tsx"]);

function collectFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? collectFiles(path) : extensions.has(extname(path)) ? [path] : [];
  });
}

const rules = [
  {
    name: "禁止超规格字重",
    pattern: /font-(?:thin|extralight|light|bold|extrabold|black)\b/g,
    allow: [],
  },
  {
    name: "禁止业务代码硬编码颜色",
    pattern: /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g,
    allow: ["src/app/components/figma/ImageWithFallback.tsx"],
  },
  {
    name: "禁止未定义的语义色阶",
    pattern: /(?:bg|text|border)-primary-(?:50|100|200|300|400|500|600|700|800|900)\b|border-warning-300\b|text-warning-900\b/g,
    allow: [],
  },
  {
    name: "禁止装饰性大圆角",
    pattern: /rounded-(?:xl|2xl|3xl)\b/g,
    allow: [],
  },
  {
    name: "禁止低于12px的页面文字",
    pattern: /text-\[(?:[0-9]|10)px\]/g,
    allow: ["src/app/components/business/StatusTabCount.tsx"],
  },
];

const violations = [];
for (const scanRoot of scanRoots) {
  for (const file of collectFiles(join(root, scanRoot))) {
    const fileName = relative(root, file);
    const lines = readFileSync(file, "utf8").split("\n");
    for (const rule of rules) {
      if (rule.allow.includes(fileName)) continue;
      lines.forEach((line, index) => {
        rule.pattern.lastIndex = 0;
        if (rule.pattern.test(line)) violations.push(`${fileName}:${index + 1} [${rule.name}] ${line.trim()}`);
      });
    }
  }
}

const badgeSource = readFileSync(join(root, "src/app/components/ui/badge.tsx"), "utf8");
for (const requiredClass of ["min-h-6", "px-2.5", "leading-4"]) {
  if (!badgeSource.includes(requiredClass)) {
    violations.push(`src/app/components/ui/badge.tsx [徽标尺寸规范] 缺少 ${requiredClass}`);
  }
}

if (violations.length > 0) {
  console.error(`Design System audit failed with ${violations.length} violation(s):`);
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exit(1);
}

console.log("Design System audit passed.");
