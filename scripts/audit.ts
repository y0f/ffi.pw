import { execSync, ExecSyncOptions } from 'child_process'
import { existsSync, writeFileSync } from 'fs'
import process from 'process'

interface ConfigTemplates {
  [key: string]: string
}

interface DepcheckResult {
  dependencies?: string[]
  devDependencies?: string[]
}

const CONFIG_TEMPLATES: ConfigTemplates = {
  'eslint.config.js': `import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactPlugin from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist', 'scripts/audit.js', 'scripts/audit.ts'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|^motion$',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  ...tseslint.configs.recommended,
];`,

  '.prettierrc.json': `{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "jsxSingleQuote": true,
  "bracketSameLine": false,
  "arrowParens": "always"
}`,

  '.prettierignore': `node_modules
dist
public
*.md
*.yml
*.json
scripts/audit.js
scripts/audit.ts`,
}

class ProjectAuditor {
  private requiredDevDependencies: string[]

  constructor() {
    this.requiredDevDependencies = [
      'typescript',
      'typescript-eslint',
      '@types/node',
      '@types/react',
      '@types/react-dom',
      'eslint',
      '@eslint/js',
      'prettier',
      'npm-check-updates',
      'depcheck',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'eslint-plugin-react-refresh',
      'globals',
    ]
  }

  run(command: string, silent = false): string | boolean {
    try {
      if (!silent) console.log(`\n→ ${command}`)
      const options: ExecSyncOptions = {
        stdio: silent ? 'pipe' : 'inherit',
        encoding: 'utf-8',
      }
      const output = execSync(command, options)
      return output?.toString().trim() || true
    } catch (error: any) {
      if (silent) {
        return error.stdout?.toString().trim() || ''
      }
      console.error(`\n✗ Command failed: ${command}`)
      console.error(error.message)
      return false
    }
  }

  ensureConfigFiles(): void {
    console.log('\n📝 Checking configuration files...')
    let createdFiles = false

    for (const [file, content] of Object.entries(CONFIG_TEMPLATES)) {
      if (!existsSync(file)) {
        writeFileSync(file, content)
        console.log(`✓ Created ${file}`)
        createdFiles = true
      }
    }

    if (!createdFiles) {
      console.log('✓ All config files exist')
    }
  }

  async ensureDependencies(): Promise<void> {
    console.log('\n📦 Checking required dependencies...')
    const missingDeps: string[] = []

    for (const dep of this.requiredDevDependencies) {
      try {
        execSync(`npm list ${dep}`, { stdio: 'ignore' })
      } catch {
        missingDeps.push(dep)
      }
    }

    if (missingDeps.length > 0) {
      console.log('⚠️ Missing dependencies:', missingDeps.join(', '))
      console.log('\n⬇️ Installing missing dependencies...')
      this.run(`npm install --save-dev ${missingDeps.join(' ')}`)
    } else {
      console.log('✓ All required dependencies are installed')
    }
  }

  async cleanUnusedPackages(): Promise<void> {
    console.log('\n🔍 Checking for unused packages...')

    let depcheckOutput = this.run('depcheck --json', true) as string
    if (!depcheckOutput) {
      depcheckOutput = this.run('npx depcheck --json', true) as string
    }

    if (!depcheckOutput) {
      console.log('⚠️ Could not run depcheck')
      return
    }

    try {
      const depcheckResult: DepcheckResult = JSON.parse(depcheckOutput)
      const unusedDeps = [
        ...(depcheckResult.dependencies || []),
        ...(depcheckResult.devDependencies || []),
      ].filter(Boolean)

      // Filter out packages that are actually needed but depcheck doesn't detect
      const protectedPackages = [
        'typescript',
        'typescript-eslint',
        '@types/node',
        '@types/react',
        '@types/react-dom',
        'vite',
        '@vitejs/plugin-react',
        'tailwindcss',
        'postcss',
        'autoprefixer',
      ]

      const actuallyUnused = unusedDeps.filter((pkg) => !protectedPackages.includes(pkg))

      if (actuallyUnused.length > 0) {
        console.log('\n🗑️ Unused packages found:')
        actuallyUnused.forEach((pkg) => console.log(`- ${pkg}`))
        console.log('\nRemoving unused packages...')
        this.run(`npm uninstall ${actuallyUnused.join(' ')}`)
      } else {
        console.log('✓ No unused packages found')
      }
    } catch (error: any) {
      console.error('⚠️ Failed to parse depcheck output:', error.message)
    }
  }

  async runLinter(): Promise<void> {
    console.log('\n🧹 Running ESLint...')
    if (!this.run('npx eslint . --fix')) {
      console.error('\n✗ ESLint found issues that need manual fixing')
      process.exit(1)
    }
  }

  async runFormatter(): Promise<void> {
    console.log('\n🎨 Formatting with Prettier...')
    const prettierOutput = this.run('npx prettier --write .', true) as string
    const changedFiles = prettierOutput
      .split('\n')
      .filter((line) => line && !line.includes('(unchanged)'))

    if (changedFiles.length > 0) {
      console.log('\nFormatted files:')
      changedFiles.forEach((file) => console.log(`- ${file}`))
    } else {
      console.log('✓ All files are properly formatted')
    }
  }

  async checkUpdates(): Promise<void> {
    console.log('\n🔄 Checking for dependency updates...')
    const updatesAvailable = this.run('npx npm-check-updates -u', true) as string

    if (updatesAvailable && updatesAvailable.includes('[major]')) {
      console.log('\n📦 Updates available:')
      console.log(updatesAvailable)
      console.log('\n⬇️ Installing updates...')
      this.run('npm install')
    } else {
      console.log('✓ All dependencies are up to date')
    }
  }

  async runSecurityAudit(): Promise<void> {
    console.log('\n🔒 Running security audit...')
    this.run('npm audit --audit-level=moderate')
  }

  async execute(): Promise<void> {
    console.log('\n🚀 Starting Project Audit\n')
    console.log('▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔')

    try {
      await this.ensureDependencies()
      this.ensureConfigFiles()
      await this.runLinter()
      await this.runFormatter()
      await this.checkUpdates()
      await this.cleanUnusedPackages()
      await this.runSecurityAudit()

      console.log('\n✅ Project audit completed successfully!')
      console.log('▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n')
    } catch (error: any) {
      console.error('\n⚠️ Audit failed with error:', error.message)
      process.exit(1)
    }
  }
}

new ProjectAuditor().execute()
