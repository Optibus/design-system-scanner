# Design System Scanner

This package scans a codebase for imports from the design system. Its main entry point is `server.js`, which you can run with `node server.js`.

This file uses `react-scanner` to scan the provided codebase and then runs a local server where you can browse the analysis.

## How to run

If you want to scan the codebase in `path/to/codebase` simply run

```
npx @optibus-internal/design-system-scanner path/to/codebase
```

You can also specify the port the server will run on using `--port`. The default is 4682.

If you're working on this package you can run `npx . path/to/codebase` or simply `node server.js path/to/codebase`.

## How to publish

Make sure the version number in `package.json` is correct, and then:

```
npm publish
```

But only if you have a Gemfury account and you've logged in using `npm login`
