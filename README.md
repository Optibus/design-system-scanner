# Design System Scanner

This package scans a codebase for imports from the design system. Its main entry point is `index.js`.

This file uses `react-scanner` to scan the provided codebase and then runs a local server where you can browse the analysis.

## How to run (as in: generate a report)

If you want to scan the codebase in `path/to/codebase` you should run

```
npx @optibus-internal/design-system-scanner path/to/codebase
```

If you're working on this package you can run `npx . path/to/codebase` or simply `node index.js path/to/codebase`. There's a script to run it on itself (which wouldn't yield much): `npm run start`

## How to run (as in: work on this package)

You can also specify the `--server` flag, which would spin up a vite server with hot reloading:

```
node index.js path/to/codebase --server
```

Or `npm run dev` which analyzes itself which wouldn't yield much.

## How to publish

Make sure the version number in `package.json` is correct. You can bump it with

```
npm version patch --no-git-tag-version --no-commit-hooks
```

And then

```
npm publish
```

But only if you have a Gemfury account and you've logged in using `npm login`.
