---
name: umbraco-package-scaffold
description: Scaffold or restructure an Umbraco community NuGet package with the recommended project layout — a Razor SDK package project with embedded backoffice Client (TypeScript/Vite/Lit), a demo Umbraco site that references it, GitHub CI release workflow, marketplace metadata, and all supporting config files. Use this skill whenever the user wants to create a new Umbraco package, set up an Umbraco community package project, restructure an existing Umbraco extension into the standard package layout, or mentions scaffolding an Umbraco NuGet package. Also use it when the user asks about the recommended folder structure for an Umbraco backoffice extension package.
---

# Umbraco Package Scaffold

This skill creates (or restructures into) the standard layout for an Umbraco community NuGet package that ships both C# backend logic and a backoffice Client built with TypeScript, Vite, and Lit.

## When to use

- User wants to **create a new** Umbraco package from scratch.
- User wants to **restructure** an existing Umbraco extension project into this layout.
- User asks about the **recommended folder structure** for an Umbraco backoffice package.

## Gather information first

Before generating anything, collect the following from the user (infer from context where possible, ask only for what's missing):

| Parameter | Example | Required |
|-----------|---------|----------|
| **PackageName** | `EnvironmentIndicator` | Yes |
| **PackageFullName** | `Umbraco.Community.EnvironmentIndicator` | Yes (default: `Umbraco.Community.{PackageName}`) |
| **AuthorName** | `Søren Kottal` | Yes |
| **AuthorGitHub** | `skttl` | Yes |
| **Description** | One-liner for NuGet + marketplace | Yes |
| **License** | `MIT` | Yes (default: MIT) |
| **Category** | `Developer Tools` | Yes (default: `Developer Tools`) |
| **Tags** | `["environment","indicator"]` | No |
| **UmbracoVersion** | `17.0.0` | Use latest stable at time of generation |
| **TargetFramework** | `net10.0` | Match the Umbraco version's TFM |

Look up the latest stable Umbraco CMS NuGet version and its corresponding .NET TFM. The Umbraco major version and .NET TFM are coupled — e.g. Umbraco 15 → net9.0, Umbraco 16/17 → net10.0. Use the correct pairing.

## Target layout

```
{repo-root}/
├── .github/
│   ├── README.md              # Public-facing README (badges, install, config, screenshots)
│   ├── CONTRIBUTING.md        # Dev setup, PR guidelines
│   ├── FUNDING.yml            # GitHub Sponsors
│   └── workflows/
│       └── release.yml        # Tag-triggered: npm build → dotnet pack → NuGet push → GH Release
├── assets/
│   └── icon.png               # NuGet / marketplace icon (user provides)
├── src/
│   ├── {PackageFullName}/                        # ← The NuGet package project
│   │   ├── {PackageFullName}.csproj              # Razor SDK, targets {TFM}
│   │   ├── README.md                             # NuGet README (packed into .nupkg)
│   │   ├── Constants.cs
│   │   ├── Composers/
│   │   │   └── {PackageName}Composer.cs          # IComposer — DI registration
│   │   ├── Configuration/
│   │   │   └── {PackageName}Options.cs           # Options POCO bound to config section
│   │   ├── Controllers/                          # API controllers (if needed)
│   │   ├── Models/                               # Response/request DTOs
│   │   ├── Services/                             # Business logic
│   │   ├── Middleware/                            # ASP.NET middleware (if needed)
│   │   ├── Client/                               # ← Backoffice frontend
│   │   │   ├── package.json
│   │   │   ├── tsconfig.json
│   │   │   ├── vite.config.ts
│   │   │   ├── public/
│   │   │   │   └── umbraco-package.json          # Umbraco extension manifest (bundle entry)
│   │   │   └── src/
│   │   │       └── bundle.manifests.ts           # Registers all backoffice extensions
│   │   └── wwwroot/
│   │       └── App_Plugins/{PackageFullName}/    # Vite build output (gitignored)
│   └── {PackageFullName}.Demo/                   # ← Local dev Umbraco site
│       ├── {PackageFullName}.Demo.csproj
│       ├── Program.cs
│       ├── Properties/
│       │   └── launchSettings.json
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       └── .gitignore                            # Umbraco data/logs/media
├── .gitignore
├── LICENSE
└── umbraco-marketplace.json
```

## How to generate each file

Read the reference templates in `references/templates.md` for the exact content of every generated file. The templates use `{{placeholder}}` tokens — replace them with the gathered parameters.

Key rules for each file:

### .csproj (package project)

- SDK: `Microsoft.NET.Sdk.Razor`
- `<StaticWebAssetBasePath>/</StaticWebAssetBasePath>` — this is essential so wwwroot files are served at the app root, not under `_content/`.
- `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>` with `<WarningsNotAsErrors>NU1902,NU1903</WarningsNotAsErrors>` to suppress NuGet audit warnings that would break the build.
- Pack the `assets/icon.png` and `README.md` into the NuGet package.
- Reference `Umbraco.Cms` at the target version.

### .csproj (demo project)

- SDK: `Microsoft.NET.Sdk.Web`
- `<CompressionEnabled>false</CompressionEnabled>` — Umbraco backoffice serves pre-compressed assets; .NET compression would double-compress.
- References the package project via `<ProjectReference>`.
- Includes `Umbraco.Cms` and `Umbraco.Cms.DevelopmentMode.Backoffice` (same version).
- Includes `Clean` package for a clean Umbraco starter.
- ICU configuration for cross-platform globalization.
- Razor settings for backoffice compatibility.

### Client/vite.config.ts

- Entry: `src/bundle.manifests.ts`
- Format: ES module
- Output dir: `../wwwroot/App_Plugins/{PackageFullName}`
- `emptyOutDir: true`, `sourcemap: true`
- Externalize `@umbraco` packages (they're provided by the backoffice shell at runtime).

### Client/package.json

- `"type": "module"`, `"private": true`
- Scripts: `build`, `watch`, `dev`, `check` (tsc --noEmit)
- devDependencies: `@umbraco-cms/backoffice`, `typescript`, `vite`, `@types/node`
- Use `^` ranges pinned to the target Umbraco backoffice version.

### Client/tsconfig.json

- Target/module: `ES2022`, moduleResolution: `Bundler`
- `strict: true`, `noEmit: true`, `skipLibCheck: true`
- Explicitly list files in `include` (no glob wildcards).

### Client/public/umbraco-package.json

This is the Umbraco extension manifest that gets copied to the build output. It registers a **bundle** extension pointing at the Vite-built JS file:

```json
{
  "name": "{{ExtensionName}}",
  "version": "0.1.0",
  "extensions": [
    {
      "name": "{{PackageName}} Bundle",
      "alias": "{{PackageName}}.Bundle",
      "type": "bundle",
      "js": "/App_Plugins/{{PackageFullName}}/{{bundle-filename}}.js"
    }
  ]
}
```

### Client/src/bundle.manifests.ts

This is the bundle entry point. It imports manifest types from `@umbraco-cms/backoffice/extension-registry` and exports a `manifests` array. Start with an empty array — the user will add their own extensions later. Include a commented-out example showing the pattern.

### Composer

The composer is an `IComposer` that registers services and binds configuration options. Generate a minimal one that binds the options class to the config section `Umbraco:Community:{PackageName}`.

### release.yml (GitHub Actions)

Tag-triggered workflow that:
1. Checks out the repo
2. Sets up .NET SDK (matching TFM)
3. Updates `umbraco-package.json` version from the tag
4. Sets up Node.js 22+
5. `npm install` + `npm run build` in the Client folder
6. `dotnet pack` with `/p:Version` from the tag
7. Pushes to NuGet (requires `NUGET_API_KEY` secret)
8. Generates a changelog from git log
9. Creates a GitHub Release with the .nupkg attached

### .gitignore (root)

Must ignore:
- Standard .NET build artifacts (`bin/`, `obj/`, `.vs/`)
- `node_modules/`
- Vite build output: `src/{PackageFullName}/wwwroot/App_Plugins/`
- Umbraco runtime data: `**/umbraco/Data/`, `**/umbraco/Logs/`, etc.
- Generated schema files: `appsettings-schema*.json`, `umbraco-package-schema.json`

### umbraco-marketplace.json

Marketplace listing metadata with author details, category, description, tags, and screenshots array.

## Restructuring an existing project

When the user has an existing project to restructure:

1. **Audit** the current layout — identify which files map to which slots in the target layout.
2. **Present a migration plan** before making changes — list every file move, rename, and new file.
3. **Move files** into the target structure, updating namespaces, `using` statements, and project references as needed.
4. **Create missing files** (e.g., if there's no Client folder, scaffold it; if there's no demo site, create one).
5. **Verify** the .csproj files build and the Client `npm run build` succeeds.

## After scaffolding

Once files are generated, tell the user the next steps:

1. `cd src/{PackageFullName}/Client && npm install && npm run build`
2. `cd src/{PackageFullName}.Demo && dotnet run`
3. Add a `NUGET_API_KEY` secret to the GitHub repo for the release workflow.
4. Replace `assets/icon.png` with a real package icon.
5. Start adding backoffice extensions in `Client/src/` and register them in `bundle.manifests.ts`.
