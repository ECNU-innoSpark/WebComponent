#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { CONFIG_FILE, getRegistryItem, publicRegistry, registry } from "./registry.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(SCRIPT_DIR, "..");
const DEFAULT_CONFIG = {
  componentsDir: "src/components/aiwc",
  installed: [],
  schemaVersion: 1
};

main();

function main() {
  const { command, options, positionals } = parseArgs(process.argv.slice(2));
  const cwd = path.resolve(options.cwd ?? process.cwd());

  try {
    if (!command || command === "help" || command === "--help" || command === "-h") {
      printHelp();
      return;
    }

    if (command === "init") {
      handleInit(cwd, options);
      return;
    }

    if (command === "view" || command === "list") {
      handleView(positionals[0]);
      return;
    }

    if (command === "add") {
      handleAdd(cwd, positionals, options);
      return;
    }

    exitWithError(`未知命令: ${command}`);
  } catch (error) {
    exitWithError(error instanceof Error ? error.message : String(error));
  }
}

function parseArgs(args) {
  const positionals = [];
  const options = {};
  let command = "";

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (!command && !arg.startsWith("-")) {
      command = arg;
      continue;
    }

    if (arg === "--cwd") {
      options.cwd = args[index + 1];
      index += 1;
      continue;
    }

    if (arg.startsWith("--cwd=")) {
      options.cwd = arg.slice("--cwd=".length);
      continue;
    }

    if (arg === "--components-dir") {
      options.componentsDir = args[index + 1];
      index += 1;
      continue;
    }

    if (arg.startsWith("--components-dir=")) {
      options.componentsDir = arg.slice("--components-dir=".length);
      continue;
    }

    if (arg === "--overwrite") {
      options.overwrite = true;
      continue;
    }

    if (arg === "--skip-install") {
      options.skipInstall = true;
      continue;
    }

    positionals.push(arg);
  }

  return { command, options, positionals };
}

function handleInit(cwd, options) {
  ensurePackageJson(cwd);

  const configPath = path.join(cwd, CONFIG_FILE);

  if (fs.existsSync(configPath)) {
    console.log(`已存在 ${CONFIG_FILE}，跳过初始化。`);
    return;
  }

  const config = {
    ...DEFAULT_CONFIG,
    componentsDir: options.componentsDir ?? DEFAULT_CONFIG.componentsDir
  };

  writeJson(configPath, config);
  console.log(`已创建 ${CONFIG_FILE}`);
  console.log(`组件将安装到 ${config.componentsDir}`);
}

function handleView(name) {
  if (!name) {
    console.log("可安装组件：");

    for (const item of publicRegistry) {
      console.log(`- ${item.name}: ${item.description}`);
    }

    console.log("");
    console.log("查看详情示例：");
    console.log("  aiwc view chat-panel");
    return;
  }

  const item = getRegistryItem(name);

  if (!item || item.internal) {
    exitWithError(`找不到组件: ${name}`);
  }

  console.log(`${item.name}`);
  console.log(`${item.description}`);

  if (item.registryDependencies?.length) {
    console.log("");
    console.log(`内部依赖: ${item.registryDependencies.join(", ")}`);
  }

  if (item.externalDependencies?.length) {
    console.log(`外部依赖: ${item.externalDependencies.join(", ")}`);
  }

  console.log("");
  console.log("源码文件：");

  for (const file of collectFiles(item.name)) {
    console.log(`- ${file}`);
  }

  console.log("");
  console.log(`安装命令: pnpm dlx @innospark/ai-web-component add ${item.name}`);
}

function handleAdd(cwd, names, options) {
  if (names.length === 0) {
    exitWithError("请至少提供一个组件名，例如: aiwc add chat-panel");
  }

  ensurePackageJson(cwd);

  const config = ensureConfig(cwd, options);
  const requestedItems = names.map((name) => {
    const item = getRegistryItem(name);

    if (!item || item.internal) {
      exitWithError(`找不到组件: ${name}`);
    }

    return item.name;
  });

  const itemsToInstall = resolveItems(requestedItems);
  const createdFiles = [];
  const updatedFiles = [];
  const skippedFiles = [];

  for (const file of collectFilesFromItems(itemsToInstall)) {
    const sourcePath = path.join(PACKAGE_ROOT, file);
    const targetPath = path.join(cwd, config.componentsDir, mapSourceToTarget(file));
    const sourceContent = transformSourceContent(file, fs.readFileSync(sourcePath, "utf8"));

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });

    if (!fs.existsSync(targetPath)) {
      fs.writeFileSync(targetPath, sourceContent, "utf8");
      createdFiles.push(path.relative(cwd, targetPath));
      continue;
    }

    const existingContent = fs.readFileSync(targetPath, "utf8");

    if (existingContent === sourceContent) {
      continue;
    }

    if (options.overwrite) {
      fs.writeFileSync(targetPath, sourceContent, "utf8");
      updatedFiles.push(path.relative(cwd, targetPath));
      continue;
    }

    skippedFiles.push(path.relative(cwd, targetPath));
  }

  const installedSet = new Set(config.installed);

  for (const itemName of requestedItems) {
    installedSet.add(itemName);
  }

  config.installed = Array.from(installedSet).sort();
  writeJson(path.join(cwd, CONFIG_FILE), config);
  writeIndexFile(cwd, config);

  const externalDependencies = collectExternalDependencies(itemsToInstall);

  if (!options.skipInstall && externalDependencies.length > 0) {
    installDependencies(cwd, externalDependencies);
  }

  console.log(`已处理 ${requestedItems.length} 个组件: ${requestedItems.join(", ")}`);

  if (createdFiles.length > 0) {
    console.log("");
    console.log("新增文件：");

    for (const file of createdFiles) {
      console.log(`- ${file}`);
    }
  }

  if (updatedFiles.length > 0) {
    console.log("");
    console.log("更新文件：");

    for (const file of updatedFiles) {
      console.log(`- ${file}`);
    }
  }

  if (skippedFiles.length > 0) {
    console.log("");
    console.log("以下文件已存在且内容不同，已跳过：");

    for (const file of skippedFiles) {
      console.log(`- ${file}`);
    }

    console.log("");
    console.log("如需覆盖，请追加 --overwrite。");
  }

  if (externalDependencies.length > 0 && options.skipInstall) {
    console.log("");
    console.log(`请手动安装依赖: ${externalDependencies.join(" ")}`);
  }

  console.log("");
  console.log(`本地导入入口: ${normalizePath(path.join(config.componentsDir, "index.ts"))}`);
}

function printHelp() {
  console.log("AIWC Source Installer");
  console.log("");
  console.log("用法：");
  console.log("  aiwc init");
  console.log("  aiwc add chat-panel");
  console.log("  aiwc add session-list-panel file-manager-panel");
  console.log("  aiwc view");
  console.log("  aiwc view chat-panel");
  console.log("");
  console.log("可选参数：");
  console.log("  --cwd <path>             在指定目录执行");
  console.log("  --components-dir <path>  自定义安装目录");
  console.log("  --overwrite              覆盖已有不同内容的文件");
  console.log("  --skip-install           跳过依赖安装");
}

function ensurePackageJson(cwd) {
  const packageJsonPath = path.join(cwd, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    exitWithError(`当前目录缺少 package.json: ${cwd}`);
  }
}

function ensureConfig(cwd, options) {
  const configPath = path.join(cwd, CONFIG_FILE);

  if (!fs.existsSync(configPath)) {
    const config = {
      ...DEFAULT_CONFIG,
      componentsDir: options.componentsDir ?? DEFAULT_CONFIG.componentsDir
    };
    writeJson(configPath, config);
    console.log(`未检测到 ${CONFIG_FILE}，已自动创建默认配置。`);
    return config;
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  return {
    ...DEFAULT_CONFIG,
    ...config,
    installed: Array.isArray(config.installed) ? config.installed : []
  };
}

function writeIndexFile(cwd, config) {
  const lines = config.installed
    .map((name) => getRegistryItem(name))
    .filter((item) => item && !item.internal)
    .flatMap((item) => item.exports ?? []);
  const uniqueLines = Array.from(new Set(lines));
  const indexPath = path.join(cwd, config.componentsDir, "index.ts");

  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, `${uniqueLines.join("\n")}\n`, "utf8");
}

function resolveItems(names, seen = new Set()) {
  for (const name of names) {
    if (seen.has(name)) {
      continue;
    }

    const item = getRegistryItem(name);

    if (!item) {
      exitWithError(`找不到组件: ${name}`);
    }

    seen.add(item.name);

    if (item.registryDependencies?.length) {
      resolveItems(item.registryDependencies, seen);
    }
  }

  return Array.from(seen);
}

function collectFiles(itemName, seen = new Set()) {
  const item = getRegistryItem(itemName);

  if (!item) {
    return [];
  }

  for (const file of item.files) {
    seen.add(file);
  }

  for (const dependency of item.registryDependencies ?? []) {
    collectFiles(dependency, seen);
  }

  return Array.from(seen).sort();
}

function collectFilesFromItems(items) {
  const files = new Set();

  for (const itemName of items) {
    for (const file of collectFiles(itemName)) {
      files.add(file);
    }
  }

  return Array.from(files).sort();
}

function collectExternalDependencies(items) {
  const deps = new Set();

  for (const itemName of items) {
    const item = getRegistryItem(itemName);

    for (const dep of item?.externalDependencies ?? []) {
      deps.add(dep);
    }
  }

  return Array.from(deps).sort();
}

function installDependencies(cwd, dependencies) {
  const command = detectPackageManager(cwd);
  const args =
    command === "npm"
      ? ["install", ...dependencies]
      : ["add", ...dependencies];

  console.log("");
  console.log(`正在安装依赖: ${dependencies.join(", ")}`);

  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    exitWithError(`依赖安装失败，请手动执行: ${command} ${args.join(" ")}`);
  }
}

function detectPackageManager(cwd) {
  const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf8"));
  const packageManagerField = packageJson.packageManager ?? "";

  if (packageManagerField.startsWith("pnpm@") || fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (packageManagerField.startsWith("yarn@") || fs.existsSync(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }

  if (packageManagerField.startsWith("bun@") || fs.existsSync(path.join(cwd, "bun.lockb"))) {
    return "bun";
  }

  return "npm";
}

function mapSourceToTarget(sourceFile) {
  if (sourceFile.startsWith("src/components/")) {
    return sourceFile.slice("src/components/".length);
  }

  if (sourceFile.startsWith("src/styles/")) {
    return `styles/${sourceFile.slice("src/styles/".length)}`;
  }

  throw new Error(`不支持的源码路径: ${sourceFile}`);
}

function transformSourceContent(sourceFile, content) {
  if (sourceFile.startsWith("src/components/shared/")) {
    return content.replace(/"\.\.\/\.\.\/styles\//g, '"../styles/');
  }

  if (sourceFile.startsWith("src/components/")) {
    return content.replace(/"\.\.\/styles\//g, '"./styles/');
  }

  return content;
}

function normalizePath(value) {
  return value.split(path.sep).join("/");
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function exitWithError(message) {
  console.error(message);
  process.exit(1);
}
