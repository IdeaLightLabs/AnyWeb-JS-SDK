# AnyWeb Contributing Guide

Hi! We're really excited that you are interested in contributing to AnyWeb. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)

## Issue Reporting Guidelines

- Always follow the issue template to create new issues.
- Here is some [templates](https://github.com/IdeaLightLabs/AnyWeb-JS-SDK/issues/new/choose) to report a bug, Please use it when reporting a bug.

## Pull Request Guidelines

- Checkout a topic branch from a base branch, e.g. `main`, and merge back against that branch.

- Title format:
  - feat - new feature
  - fix - fix bugs
  - docs - documentation only changes
  - style - style changes
  - test - add tests
  - chore - changes that don't affect the meaning of the code
  - revert - revert to a commit
  - close - close an issue
  - release - release
    ```
    # Title Example
    feat: add new feature
    docs: update install info
    fix: fix undefined error
    close: #1, #3
    ```

  - Make sure tests pass!

  - Commit messages must follow the [Angular commit message convention](https://gist.github.com/brianclements/841ea7bffdb01346392c) so that the changelog can be automatically generated. Commit messages are automatically validated before commit.


## Development Setup

You will need [Node.js](http://nodejs.org) **version 12+**, and [Yarn](https://classic.yarnpkg.com/en/docs/install).

After cloning the repo, run:

```bash
$ yarn # install the dependencies of the project
```

A high level overview of tools used:

- [TypeScript](https://www.typescriptlang.org/) as the development language
- [Babel](https://babeljs.io) for bundling
- [Prettier](https://prettier.io/) for code formatting

## Scripts

### `yarn build`

The `build` script builds AnyWeb.

```bash
# build the AnyWeb.
yarn build
```

### `yarn test`

The `yarn test` script runs all checks:

```bash
# run all tests.
$ yarn test
```

## Project Structure

Vue Router source code can be found in the `src` directory:

- `src/utils`: contains small utility functions.
- `src/errors`: different internal and external errors
- `src/interface`: contains all interface
