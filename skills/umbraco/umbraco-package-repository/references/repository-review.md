# Source repository review

Reviewed on 5 November 2026 using shallow clones of the four repositories' default branches. Historical branches, runtime behavior and published NuGet packages were not tested. References to older version branches come from README files and workflows, not inspection of those branches.

## Sources

Links use the reviewed commits so the observations remain reproducible.

| Repository | Commit | Key files |
| --- | --- | --- |
| LogLevels | `903186cd86aa33856f712a340389c95f78f5b03b` | [README](https://github.com/skttl/umbraco-loglevels/blob/903186cd86aa33856f712a340389c95f78f5b03b/README.md), [package project](https://github.com/skttl/umbraco-loglevels/blob/903186cd86aa33856f712a340389c95f78f5b03b/src/Umbraco.Community.LogLevels/Umbraco.Community.LogLevels.csproj), [Vite](https://github.com/skttl/umbraco-loglevels/blob/903186cd86aa33856f712a340389c95f78f5b03b/src/Umbraco.Community.LogLevels/Client/vite.config.ts), [publishing](https://github.com/skttl/umbraco-loglevels/blob/903186cd86aa33856f712a340389c95f78f5b03b/.github/workflows/publish.yml) |
| Handbook | `ca5e041c598559e7ba0c1b06512dbf63fdd8f982` | [README](https://github.com/skttl/umbraco-handbook/blob/ca5e041c598559e7ba0c1b06512dbf63fdd8f982/README.md), [package project](https://github.com/skttl/umbraco-handbook/blob/ca5e041c598559e7ba0c1b06512dbf63fdd8f982/src/Umbraco.Community.Handbook/Umbraco.Community.Handbook.csproj), [Vite](https://github.com/skttl/umbraco-handbook/blob/ca5e041c598559e7ba0c1b06512dbf63fdd8f982/src/Umbraco.Community.Handbook/Client/vite.config.ts), [publishing](https://github.com/skttl/umbraco-handbook/blob/ca5e041c598559e7ba0c1b06512dbf63fdd8f982/.github/workflows/publish.yml) |
| Graph Mail Sender | `bf2d0c089d0d1ed6841dec674a876dde134d667e` | [README](https://github.com/skttl/umbraco-graph-mail-sender/blob/bf2d0c089d0d1ed6841dec674a876dde134d667e/README.md), [shared build settings](https://github.com/skttl/umbraco-graph-mail-sender/blob/bf2d0c089d0d1ed6841dec674a876dde134d667e/Directory.Build.props), [package verification](https://github.com/skttl/umbraco-graph-mail-sender/blob/bf2d0c089d0d1ed6841dec674a876dde134d667e/scripts/verify-package.py), [CI](https://github.com/skttl/umbraco-graph-mail-sender/blob/bf2d0c089d0d1ed6841dec674a876dde134d667e/.github/workflows/ci.yml) |
| SMTP OAuth Mail Sender | `1eeab470a034a150cae6ec0169f8ef3f6d9090b7` | [README](https://github.com/skttl/umbraco-smtp-oauth-mail-sender/blob/1eeab470a034a150cae6ec0169f8ef3f6d9090b7/README.md), [package project](https://github.com/skttl/umbraco-smtp-oauth-mail-sender/blob/1eeab470a034a150cae6ec0169f8ef3f6d9090b7/src/Umbraco.Community.SmtpOAuthMailSender/Umbraco.Community.SmtpOAuthMailSender.csproj), [schema target](https://github.com/skttl/umbraco-smtp-oauth-mail-sender/blob/1eeab470a034a150cae6ec0169f8ef3f6d9090b7/buildTransitive/Umbraco.Community.SmtpOAuthMailSender.targets), [publishing](https://github.com/skttl/umbraco-smtp-oauth-mail-sender/blob/1eeab470a034a150cae6ec0169f8ef3f6d9090b7/.github/workflows/publish.yml) |

## Shared patterns

All four repositories have an SDK-based package project under `src/`, separate server tests, a site with a project reference and a `.slnx` solution. They separate the developer README from the NuGet README and include Marketplace metadata, a Marketplace introduction, an icon and a license. CI and tag-triggered publishing use separate workflows, with OIDC for publishing.

Package IDs follow `Umbraco.Community.<Name>`. Package majors follow Umbraco majors, with bounded dependency intervals. The reviewed default branches target Umbraco 18. Their README files describe older version lines too.

## Differences and the new conventions

| Topic | Observation | New convention |
| --- | --- | --- |
| Demo location | LogLevels uses `tests/`, Handbook uses `demo/`, mail packages use `examples/`. | Use `demo/` and generate a clean site with the official Umbraco template. |
| Starter kit | LogLevels and Handbook use Clean; mail packages have smaller test sites. | No starter kit by default. |
| Server code | LogLevels separates Engine, Integration and Controllers. Other packages mostly use a flat structure. | One project; folders as needed. |
| Backoffice | LogLevels and Handbook use TypeScript, Vite and generated OpenAPI clients under `Client/`. Mail packages have no client. | Add a client only when needed. |
| Assets | LogLevels builds into `wwwroot` with `StaticWebAssetBasePath=App_Plugins/LogLevels`. Handbook builds into `wwwroot/App_Plugins/Handbook` with base path `/`. | Use the LogLevels model. |
| Generated output | LogLevels tracks built files in Git; Handbook ignores client output. | Ignore generated client output and rebuild in CI. |
| Multiple majors | Mail packages use `Directory.Build.props`, `UmbracoMajor` and a matrix for 13, 17 and 18. Backoffice packages use branch-specific project settings. | Independent version branches. A shared major property is optional. |
| Schema | Handbook and both mail packages pack an appsettings schema and `buildTransitive` target. LogLevels has no custom schema. | Optional for custom configuration benefiting from editor support. |
| CI | LogLevels and mail packages run on Windows and Linux; Handbook uses Ubuntu. Mail packages inspect nupkg contents in CI; backoffice packages do this during publishing. | Use the same package checks in CI and publishing. Choose OS coverage as needed. |

## Useful examples to adapt

The mail packages' small `verify-package.py` checks the artifact being published. It verifies ID/version, DLL/TFM, Umbraco interval, README, icon, notices, schema and target. Package IDs and version lines are specific to those packages and must be adapted. Extend the check to client assets and unwanted content where relevant.

The backoffice packages exclude client sources from NuGet content while shipping Razor static web assets. Both include generated OpenAPI bindings and client tests beside the code. These are useful optional parts; server-only packages do not need Node.js.

Publishing workflows demonstrate branch ancestry checks, tag-to-version conversion, prereleases and OIDC. Treat them as examples to adapt rather than templates to copy unchanged. Check full SemVer validation and the current branch's major in particular.

## Agreed choices and draft recommendations

The user explicitly chose `demo/`, official Umbraco template generation, a clean SQLite site with a project reference, version branches, a shared package ID, matching majors, the lowest possible Umbraco dependency floor, the LogLevels asset model, separate CI/publishing workflows, OIDC, prereleases and documentation split with usage links in the root README.

The draft additionally recommends ignoring generated client output, adding schemas and OS coverage as needed, and testing installation of the built NuGet package. Those recommendations were not separately approved as requirements during the design conversation.

## Manual invocation

`agents/openai.yaml` sets `policy.allow_implicit_invocation: false`. According to [OpenAI: Build skills](https://learn.chatgpt.com/docs/build-skills), this disables implicit invocation while explicit `$umbraco-package-repository` invocation remains available. It does not remove instructions already loaded in an ongoing chat. Other agents may handle invocation policy differently.
