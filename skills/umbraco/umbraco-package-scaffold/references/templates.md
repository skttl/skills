# File Templates

All templates use `{{placeholder}}` tokens. Replace them with the values gathered from the user.

## Placeholder reference

| Placeholder | Example value |
|-------------|---------------|
| `{{PackageName}}` | `EnvironmentIndicator` |
| `{{PackageFullName}}` | `Umbraco.Community.EnvironmentIndicator` |
| `{{PackageFullNameDemo}}` | `Umbraco.Community.EnvironmentIndicator.Demo` |
| `{{ExtensionName}}` | `Environment Indicator` |
| `{{AuthorName}}` | `Søren Kottal` |
| `{{AuthorGitHub}}` | `skttl` |
| `{{Description}}` | `Makes Umbraco backoffice environments stand out...` |
| `{{License}}` | `MIT` |
| `{{Category}}` | `Developer Tools` |
| `{{Tags}}` | `["environment","indicator"]` |
| `{{UmbracoVersion}}` | `17.0.0` |
| `{{UmbracoMajor}}` | `17` |
| `{{TargetFramework}}` | `net10.0` |
| `{{DotNetMajor}}` | `10` |
| `{{BundleFileName}}` | `my-package-bundle` (kebab-case of PackageName) |
| `{{ConfigSection}}` | `Umbraco:Community:EnvironmentIndicator` |
| `{{RepoUrl}}` | `https://github.com/skttl/umbraco-environment-indicator` |
| `{{RepoGitUrl}}` | `https://github.com/skttl/umbraco-environment-indicator.git` |

---

## .gitignore (root)

```
## .NET
bin/
obj/
*.user
*.suo
*.userosscache
*.sln.docstates
*.userprefs

## Visual Studio
.vs/
*.rsuser
[Dd]ebug/
[Rr]elease/
x64/
x86/
[Ww][Ii][Nn]32/
[Aa][Rr][Mm]/
[Aa][Rr][Mm]64/
bld/
[Ll]og/
[Ll]ogs/

## NuGet
*.nupkg
*.snupkg
**/[Pp]ackages/*
!**/[Pp]ackages/build/

## Node
node_modules/

## Build output (Vite)
src/{{PackageFullName}}/wwwroot/App_Plugins/

## Umbraco
**/umbraco/Data/
**/umbraco/Logs/
**/umbraco/mediacache/
**/umbraco/tmp/

## OS files
.DS_Store
Thumbs.db
appsettings-schema.json
appsettings-schema.*.json
src/{{PackageFullName}}/umbraco-package-schema.json
```

---

## LICENSE (MIT)

```
MIT License

Copyright (c) {{AuthorName}}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## umbraco-marketplace.json

```json
{
  "$schema": "https://marketplace.umbraco.com/umbraco-marketplace-schema.json",
  "AuthorDetails": {
    "Name": "{{AuthorName}}",
    "ImageUrl": "https://github.com/{{AuthorGitHub}}.png",
    "Url": "https://github.com/{{AuthorGitHub}}",
    "Contributors": [],
    "SyncContributorsFromRepository": true
  },
  "Category": "{{Category}}",
  "Description": "{{Description}}",
  "IssueTrackerUrl": "{{RepoUrl}}/issues",
  "LicenseTypes": [
    "Free"
  ],
  "PackageType": "Package",
  "Tags": {{Tags}},
  "Title": "{{ExtensionName}}",
  "Screenshots": []
}
```

---

## .github/README.md

````markdown
# {{ExtensionName}}

[![Downloads](https://img.shields.io/nuget/dt/{{PackageFullName}}?color=cc9900)](https://www.nuget.org/packages/{{PackageFullName}}/)
[![NuGet](https://img.shields.io/nuget/vpre/{{PackageFullName}}?color=0273B3)](https://www.nuget.org/packages/{{PackageFullName}})
[![GitHub license](https://img.shields.io/github/license/{{AuthorGitHub}}/{{repo-name}}?color=8AB803)](../LICENSE)

{{Description}}

## Installation

Requires **Umbraco v{{UmbracoMajor}}+**.

```bash
dotnet add package {{PackageFullName}}
```

## Configuration

<!-- Add configuration documentation here -->

## Contributing

Contributions are most welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [{{License}} License](../LICENSE).

Copyright © [{{AuthorName}}](https://github.com/{{AuthorGitHub}})
````

---

## .github/CONTRIBUTING.md

````markdown
# Contributing to {{ExtensionName}}

First off, thanks for considering contributing! Every bit of help is appreciated.

## How to Contribute

1. **Fork** the repository
2. **Create a branch** for your change (`git checkout -b feature/my-change`)
3. **Make your changes**
4. **Test** your changes against the demo site
5. **Commit** with a clear message
6. **Push** to your fork and open a **Pull Request**

## Development Setup

### Prerequisites

- [.NET {{DotNetMajor}} SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)

### Getting Started

```bash
# Clone the repo
git clone {{RepoGitUrl}}
cd {{repo-name}}

# Install frontend dependencies
cd src/{{PackageFullName}}/Client
npm install

# Build frontend
npm run build

# Run the demo site
cd ../../{{PackageFullNameDemo}}
dotnet run
```

## Reporting Issues

Use [GitHub Issues]({{RepoUrl}}/issues) to report bugs or request features.

When reporting a bug, please include:
- Umbraco version
- Package version
- Steps to reproduce
- Expected vs actual behavior
````

---

## .github/FUNDING.yml

```yaml
github: {{AuthorGitHub}}
```

---

## .github/workflows/release.yml

```yaml
name: Release Package

on:
  push:
    tags:
      - '[0-9]+.[0-9]+.[0-9]+-[a-zA-Z0-9]*'
      - '[0-9]+.[0-9]+.[0-9]+'

permissions:
  contents: write

jobs:
  build:

    runs-on: windows-latest

    steps:

    - name: Checkout repository
      uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: Setup .NET
      uses: actions/setup-dotnet@v4
      with:
        dotnet-version: {{DotNetMajor}}.0.x

    - name: Update package version
      run: |
        $version = "${{github.ref_name}}"
        $packageJsonPath = "src/{{PackageFullName}}/Client/public/umbraco-package.json"
        $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
        $packageJson.version = $version
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '22'

    - name: Install npm dependencies
      run: npm install
      working-directory: src/{{PackageFullName}}/Client

    - name: Build npm package
      run: npm run build
      working-directory: src/{{PackageFullName}}/Client

    - name: Build & Pack
      run: dotnet pack src\{{PackageFullName}}\{{PackageFullName}}.csproj -c Release /p:Version=${{github.ref_name}}

    - name: Push to NuGet
      run: dotnet nuget push **\*.nupkg -k ${{secrets.NUGET_API_KEY}} -s https://api.nuget.org/v3/index.json

    - name: Generate changelog
      id: changelog
      shell: pwsh
      run: |
        $currentTag = "${{github.ref_name}}"
        $previousTag = git tag --sort=-v:refname | Where-Object { $_ -ne $currentTag } | Select-Object -First 1
        if ($previousTag) {
          $log = git log "$previousTag..$currentTag" --pretty=format:"- %s" --no-merges
        } else {
          $log = git log --pretty=format:"- %s" --no-merges
        }
        $log = $log -join "`n"
        # Write to file to avoid escaping issues
        $log | Set-Content -Path "CHANGELOG.md"

    - name: Create GitHub Release
      uses: softprops/action-gh-release@v2
      with:
        tag_name: ${{github.ref_name}}
        name: ${{github.ref_name}}
        body_path: CHANGELOG.md
        prerelease: ${{ contains(github.ref_name, '-') }}
        files: |
          **/*.nupkg
```

**Important**: The `release.yml` template contains `${{...}}` tokens that are GitHub Actions expressions — these must be output literally, not treated as skill placeholders. Only replace the `{{DoubleColonPlaceholders}}` (no `$` prefix). The `${{github.ref_name}}`, `${{secrets.NUGET_API_KEY}}`, and `${{ contains(...) }}` tokens are GitHub Actions syntax and must remain exactly as shown.

---

## src/{{PackageFullName}}/{{PackageFullName}}.csproj

```xml
<Project Sdk="Microsoft.NET.Sdk.Razor">

  <PropertyGroup>
    <TargetFramework>{{TargetFramework}}</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <RootNamespace>{{PackageFullName}}</RootNamespace>
	<StaticWebAssetBasePath>/</StaticWebAssetBasePath>
	<TreatWarningsAsErrors>true</TreatWarningsAsErrors>
	<WarningsNotAsErrors>NU1902,NU1903</WarningsNotAsErrors>
  </PropertyGroup>

  <PropertyGroup>
    <PackageId>{{PackageFullName}}</PackageId>
    <Authors>{{AuthorName}}</Authors>
    <Description>{{Description}}</Description>
    <PackageLicenseExpression>{{License}}</PackageLicenseExpression>
    <PackageProjectUrl>{{RepoUrl}}</PackageProjectUrl>
    <RepositoryUrl>{{RepoGitUrl}}</RepositoryUrl>
    <RepositoryType>git</RepositoryType>
    <PackageIcon>icon.png</PackageIcon>
    <PackageReadmeFile>README.md</PackageReadmeFile>
    <PackageTags>umbraco-marketplace</PackageTags>
  </PropertyGroup>

  <ItemGroup>
    <None Include="..\..\assets\icon.png" Pack="true" PackagePath="\" />
    <None Include="README.md" Pack="true" PackagePath="\" />
  </ItemGroup>

  <ItemGroup>
    <PackageReference Include="Umbraco.Cms" Version="{{UmbracoVersion}}" />
  </ItemGroup>

</Project>
```

---

## src/{{PackageFullName}}/README.md (NuGet README)

```markdown
# {{ExtensionName}}

{{Description}}

## Installation

Requires **Umbraco v{{UmbracoMajor}}+**.

## Configuration

<!-- Add configuration documentation here -->
```

---

## src/{{PackageFullName}}/Constants.cs

```csharp
namespace {{PackageFullName}};

public static class Constants
{
    public const string ExtensionName = "{{ExtensionName}}";
    public const string ConfigurationSection = "{{ConfigSection}}";
}
```

---

## src/{{PackageFullName}}/Composers/{{PackageName}}Composer.cs

```csharp
using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Core.Composing;
using {{PackageFullName}}.Configuration;

namespace {{PackageFullName}}.Composers;

public sealed class {{PackageName}}Composer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.Configure<{{PackageName}}Options>(builder.Config.GetSection(Constants.ConfigurationSection));
    }
}
```

---

## src/{{PackageFullName}}/Configuration/{{PackageName}}Options.cs

```csharp
namespace {{PackageFullName}}.Configuration;

public class {{PackageName}}Options
{
}
```

---

## src/{{PackageFullName}}/Client/package.json

```json
{
  "name": "{{npm-package-name}}",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "build": "vite build",
    "watch": "vite build --watch",
    "dev": "vite",
    "check": "tsc --noEmit"
  },
  "devDependencies": {
    "@umbraco-cms/backoffice": "^{{UmbracoBackofficeVersion}}",
    "@types/node": "^22.15.29",
    "typescript": "^5.8.3",
    "vite": "^6.4.1"
  }
}
```

The `{{npm-package-name}}` should be a kebab-case version derived from the full name, e.g. `umbraco-community-environment-indicator-backoffice`.

The `{{UmbracoBackofficeVersion}}` should match the latest published `@umbraco-cms/backoffice` npm package for the target Umbraco major version. Use `^` range so minor updates are picked up.

---

## src/{{PackageFullName}}/Client/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "types": [],
    "isolatedModules": true,
    "useDefineForClassFields": true
  },
  "include": [
    "*.ts",
    "vite.config.ts",
    "src/bundle.manifests.ts"
  ]
}
```

As new `.ts` source files are added under `Client/src/`, they should be explicitly added to the `include` array — this project avoids glob patterns in tsconfig to keep compilation explicit.

---

## src/{{PackageFullName}}/Client/vite.config.ts

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/bundle.manifests.ts",
      formats: ["es"],
      fileName: "{{BundleFileName}}",
    },
    outDir: "../wwwroot/App_Plugins/{{PackageFullName}}",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: [/^@umbraco/],
    },
  }
});
```

---

## src/{{PackageFullName}}/Client/public/umbraco-package.json

```json
{
  "name": "{{ExtensionName}}",
  "version": "0.1.0",
  "extensions": [
    {
      "name": "{{PackageName}} Bundle",
      "alias": "{{PackageName}}.Bundle",
      "type": "bundle",
      "js": "/App_Plugins/{{PackageFullName}}/{{BundleFileName}}.js"
    }
  ]
}
```

---

## src/{{PackageFullName}}/Client/src/bundle.manifests.ts

```typescript
// Import manifest types as needed, e.g.:
// import { ManifestDashboard, ManifestHeaderApp } from "@umbraco-cms/backoffice/extension-registry";

// Register your backoffice extensions here.
// Example:
//
// const dashboards: Array<ManifestDashboard> = [
//   {
//     type: "dashboard",
//     alias: "{{PackageFullName}}.Dashboard",
//     name: "{{ExtensionName}} Dashboard",
//     js: () => import("./my-dashboard.js"),
//     meta: {
//       label: "{{ExtensionName}}",
//       pathname: "{{kebab-case-name}}"
//     }
//   }
// ];

export const manifests = [
  // ...dashboards,
];
```

---

## src/{{PackageFullNameDemo}}/{{PackageFullNameDemo}}.csproj

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>{{TargetFramework}}</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <CompressionEnabled>false</CompressionEnabled>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Clean" Version="7.0.5" />
    <PackageReference Include="Umbraco.Cms" Version="{{UmbracoVersion}}" />
    <PackageReference Include="Umbraco.Cms.DevelopmentMode.Backoffice" Version="{{UmbracoVersion}}" />
  </ItemGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.ICU.ICU4C.Runtime" Version="72.1.0.3" />
    <ProjectReference Include="..\{{PackageFullName}}\{{PackageFullName}}.csproj" />
    <RuntimeHostConfigurationOption Include="System.Globalization.AppLocalIcu" Value="72.1.0.3" Condition="$(RuntimeIdentifier.StartsWith('linux')) or $(RuntimeIdentifier.StartsWith('win')) or ('$(RuntimeIdentifier)' == '' and !$([MSBuild]::IsOSPlatform('osx')))" />
  </ItemGroup>

  <PropertyGroup>
    <CopyRazorGenerateFilesToPublishDirectory>true</CopyRazorGenerateFilesToPublishDirectory>
  </PropertyGroup>

  <PropertyGroup>
    <RazorCompileOnBuild>false</RazorCompileOnBuild>
    <RazorCompileOnPublish>false</RazorCompileOnPublish>
  </PropertyGroup>

</Project>
```

---

## src/{{PackageFullNameDemo}}/Program.cs

```csharp
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .Build();

WebApplication app = builder.Build();

await app.BootUmbracoAsync();

app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

await app.RunAsync();
```

---

## src/{{PackageFullNameDemo}}/Properties/launchSettings.json

```json
{
  "$schema": "https://json.schemastore.org/launchsettings.json",
  "iisSettings": {
    "windowsAuthentication": false,
    "anonymousAuthentication": true,
    "iisExpress": {
      "applicationUrl": "http://localhost:64093",
      "sslPort": 44343
    }
  },
  "profiles": {
    "IIS Express": {
      "commandName": "IISExpress",
      "launchBrowser": true,
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }
    },
    "Umbraco.Web.UI": {
      "commandName": "Project",
      "dotnetRunMessages": true,
      "launchBrowser": true,
      "applicationUrl": "https://localhost:44343;http://localhost:64093",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development"
      }      
    }
  }
}
```

---

## src/{{PackageFullNameDemo}}/appsettings.json

```json
{
  "$schema": "appsettings-schema.json",
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "Microsoft.Hosting.Lifetime": "Information",
        "System": "Warning"
      }
    }
  },
  "Umbraco": {
    "CMS": {
      "Global": {
        "Id": "00000000-0000-0000-0000-000000000000"
      },
      "Content": {
        "AllowEditInvariantFromNonDefault": true,
        "ContentVersionCleanupPolicy": {
          "EnableCleanup": true
        }
      },
      "Unattended": {
        "UpgradeUnattended": true
      }
    }
  }
}
```

Note: The `Global:Id` should be replaced with a freshly generated GUID.

---

## src/{{PackageFullNameDemo}}/appsettings.Development.json

```json
{
  "$schema": "appsettings-schema.json",
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information"
    },
    "WriteTo": [
      {
        "Name": "Async",
        "Args": {
          "configure": [
            {
              "Name": "Console"
            }
          ]
        }
      }
    ]
  },
  "ConnectionStrings": {
    "umbracoDbDSN": "Data Source=|DataDirectory|/Umbraco.sqlite.db;Cache=Shared;Foreign Keys=True;Pooling=True",
    "umbracoDbDSN_ProviderName": "Microsoft.Data.Sqlite"
  },
  "Umbraco": {
    "CMS": {
      "Unattended": {
        "InstallUnattended": true,
        "UnattendedUserName": "Administrator",
        "UnattendedUserEmail": "admin@example.com",
        "UnattendedUserPassword": "1234567890",
        "UnattendedTelemetryLevel": "Detailed"
      },
      "Content": {
        "MacroErrors": "Throw"
      },
      "Hosting": {
        "Debug": true
      }
    }
  }
}
```

---

## src/{{PackageFullNameDemo}}/.gitignore

Use the standard Umbraco `.gitignore` for the demo site. The key entries specific to the demo are:

```
## Umbraco Data
umbraco/Data/
umbraco/Logs/
umbraco/mediacache/
umbraco/tmp/

## SQLite
*.sqlite.db
*.sqlite.db-shm
*.sqlite.db-wal

## Generated
appsettings-schema.json
appsettings-schema.*.json
umbraco-package-schema.json
```
