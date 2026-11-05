---
name: umbraco-package-repository
description: Use when defining or scaffolding the repository structure for a new Umbraco NuGet package using skttl's conventions. Also use for an explicitly requested comparison of an existing package repository with this standard.
---

# Umbraco package repository standard

Define the smallest complete repository structure for the package. This skill sets repository conventions; it does not implement the package's functionality. Apply it to new packages. When reviewing an existing repository, describe differences before making structural changes.

## Identify the package profile

Use the request and existing files. Clarify only missing choices that affect the structure:

- Package name, NuGet package ID and repository name.
- Supported Umbraco majors, including which major `main` targets.
- Server code only or a backoffice client too; whether it exposes a custom Management API.
- Custom configuration that benefits from an appsettings schema.

Default names are `umbraco-<name>` for the repository and `Umbraco.Community.<Name>` for the package ID, project name and namespace. Preserve explicitly chosen names.

## Base structure

```text
<repository>/
  <PackageId>.slnx
  README.md
  LICENSE
  icon.png
  NuGet.Config
  .gitignore
  umbraco-marketplace.json
  umbraco-marketplace-readme.md
  src/
    <PackageId>/
      <PackageId>.csproj
      <server code>
  tests/
    <PackageId>.Tests/
      <PackageId>.Tests.csproj
  demo/
    <PackageId>.TestSite/
      <site generated with the official Umbraco .NET template>
  docs/
    nuget-readme.md
  .github/
    workflows/
      ci.yml
      publish.yml
```

Include the package, tests and demo in the solution. Set `IsPackable=false` on tests and demo. Pack only the package project. Server-only packages use `Microsoft.NET.Sdk`; packages shipping backoffice assets use `Microsoft.NET.Sdk.Razor`.

For new public packages, configure nuget.org explicitly in `NuGet.Config` without credentials. Add other feeds only when needed. Preserve required feeds when reviewing existing repositories.

Start with one package project. Group server code by actual responsibilities when that improves readability. Small projects can keep their files directly in the project folder. Do not add Core, Infrastructure or Abstractions projects without a concrete need.

## Generate the demo with the Umbraco template

1. Select the Umbraco version and a compatible .NET SDK for the version branch.
2. Install or select the official `Umbraco.Templates` version that generates the intended CMS version. Inspect the installed template and its current options through template help.
3. Generate a clean site with `dotnet new umbraco` under `demo/<PackageId>.TestSite/`. Use supported template options for SQLite and other settings. Adjust the generated configuration when the selected template version requires it.
4. Preserve the generated project settings, startup, configuration and other required files. Add a project reference to the package and only the configuration needed to demonstrate it.
5. Record the exact template version and generation command in the root README. Check the generated `Umbraco.Cms` reference and start the site to verify the setup.

Handwritten `.csproj`, `Program.cs` and `appsettings.json` files do not replace template generation. If the template is missing or fails, resolve the template problem or report the blocker. Do not construct a substitute site from scratch.

SQLite and a project reference are standard. Add starter kits such as Clean only for a concrete demonstration need. Store local passwords in user secrets or an ignored development file. Ignore databases, logs, media, build output and local credentials. Do not add production setup to the demo.

## Version branches and dependencies

- `main` targets the newest supported Umbraco major. Other majors use `vN/main`.
- Keep the same NuGet package ID across branches. The package major matches the Umbraco major.
- Use the lowest possible Umbraco dependency floor and an exclusive upper bound at the next major, for example `[17.0.0,18.0.0)`.
- Raise the floor only when the APIs used or other documented requirements demand it. Explain the reason in the compatibility documentation. Verify compatibility against the declared minimum version.
- Reference the smallest Umbraco package exposing the required APIs, for example `Umbraco.Cms.Core` for server integration or `Umbraco.Cms.Api.Management` for Management APIs. The demo references the CMS package.
- Match the branch's TFM, SDK, demo and optional `@umbraco-cms/backoffice` dependency to its Umbraco major. Verify version-specific requirements instead of copying versions from the reference packages.

Each branch must build and release independently. A shared `UmbracoMajor` property and conditional compilation are not the default. Add a cross-major build matrix only when required by the task. Use `Directory.Build.props` when multiple projects actually share build policy. A `global.json` can pin the chosen SDK.

## Optional backoffice client

Add this structure only for packages with a backoffice client:

```text
src/<PackageId>/
  Client/
    package.json
    package-lock.json
    tsconfig.json
    vite.config.ts
    public/
      umbraco-package.json
    src/
      entrypoint.ts
      <client code and relevant tests>
  wwwroot/                    # generated client output
```

Use this consistent asset model:

- Set the Razor project's `StaticWebAssetBasePath` to `App_Plugins/<Name>`.
- Build Vite from `Client/` into `../wwwroot`, copying the manifest from `Client/public/`.
- Point the manifest entrypoint to `/App_Plugins/<Name>/<entrypoint>.js`.
- Externalize Umbraco browser modules under `@umbraco-cms/` when bundling.
- Exclude `Client/**`, including `node_modules`, from raw NuGet package content.
- Rebuild client output in CI before .NET build and pack. Ignore generated output in Git for new repositories.

Do not combine this model with output into `wwwroot/App_Plugins/<Name>`, which can duplicate the URL path. Verify URLs for dynamic chunks and other client assets too.

For a custom Management API, add `Client/openapi-ts.config.ts` and generated bindings under `Client/src/api/`. Document regeneration against the demo's version-specific OpenAPI document, commit the bindings and connect the client to Umbraco's auth context. Do not edit generated bindings manually. Installing the package must not require Node.js or a running generator site.

Use version-appropriate Umbraco guidance when implementing APIs and clients. Do not apply the modern backoffice structure to Umbraco 13's AngularJS backoffice.

## Optional configuration schema

When custom configuration benefits from editor support, add:

```text
appsettings-schema.<PackageId>.json
buildTransitive/<PackageId>.targets
```

Pack both files. Register the schema through the target Umbraco version's relevant schema items. Validate the schema, target and registration in a site that installs the NuGet package. LogLevels has no package-specific schema, illustrating that these files are conditional.

## Documentation and NuGet content

The root `README.md` describes purpose, repository layout, prerequisites, local startup, build, testing and releases. Include visible links to the package documentation covering installation, configuration and how to use the package.

`docs/nuget-readme.md` is the user documentation entry point and is packed as `README.md` in NuGet. Cover compatibility, installation, registration and configuration where applicable, and a concrete usage example. Larger guides can use additional files under `docs/`. Links in the packed README must work on NuGet, including links to documentation on GitHub.

`umbraco-marketplace.json` describes the package, includes documentation and issue links, and follows the current Marketplace schema. `umbraco-marketplace-readme.md` provides a user-facing introduction and links to installation and usage documentation.

Set package ID, version, author, description, repository/project URLs, license, tags including `umbraco-marketplace`, README and icon in the package project. Pack `icon.png` and the user-facing README at the paths declared in the metadata. Choose the license and attribution based on the actual package; do not copy unrelated third-party notices. Include `THIRD-PARTY-NOTICES` and bundled dependency notices when the assets or dependencies require them.

## CI and publishing

Run `ci.yml` on pull requests and relevant version branches with read-only repository permissions. For each supported branch, verify:

1. Reproducible client dependency installation, client tests and client build when the package has a client.
2. .NET restore, solution build including the demo, and relevant server tests.
3. Pack the package project into `artifacts/`.
4. Inspect the actual `.nupkg` using the same checks as the publishing workflow.

`publish.yml` accepts stable tags such as `v17.0.0` and SemVer prereleases such as `v17.0.0-rc1` and `v17.0.0-beta.2`. Remove only the leading `v` to obtain the NuGet version. Validate the whole tag as a stable version or prerelease, including prerelease identifier rules. A GitHub tag filter alone is insufficient.

Before publishing, check that the tag major matches the branch's package version and Umbraco dependency. Use `git merge-base --is-ancestor` to verify that the tagged commit is an ancestor of the expected remote version branch's tip. Fetch enough history and branch refs for that check. Build, test, pack and verify the version specified by the tag. Do not reuse published version numbers.

Publish through NuGet trusted publishing with GitHub OIDC, a `release` environment, `contents: read`, `id-token: write` and a matching NuGet trust policy. Document required GitHub/NuGet settings and the `NUGET_USER` account name. Store no permanent NuGet API key. Check current official action versions and setup when implementing the workflow.

Choose an OS matrix based on the package's needs. Windows and Linux coverage helps when filesystem or OS behavior matters; it is not required for every package.

## Verify the built package

Reuse a small check in CI and publishing, for example `scripts/verify-package.py`, when the project needs it. Fail on incorrect ID, version, framework, Umbraco interval or missing required files.

Inspect the DLL, README and icon, plus manifest, JavaScript, chunks, schema, targets and notices when applicable. Check that demo content, credentials, local databases, `node_modules` and raw client sources are absent.

A project-reference site does not prove that the NuGet package installs correctly. When establishing the repository or changing packaging, also install the built `.nupkg` in a separate clean, template-generated Umbraco site. Verify startup, package registration and relevant asset URLs or schema registration. Use the declared minimum CMS version to substantiate the compatibility claim. Keep this site separate from the demo's project reference.

## Deliver the result

For a structure definition, provide a concrete tree, chosen versions/branches, optional parts and short reasons. For scaffolding, provide the files and relevant checks. Applying this skill alone does not authorize creating remote repositories, remote version branches, tags or NuGet releases.

Finish with what was verified and what remains. Distinguish a proposed structure, generated files, a successful build and a verified package installation.

Read [references/repository-review.md](references/repository-review.md) for background, source files or differences among the four reference packages. The conventions above take precedence over variations in those examples.
