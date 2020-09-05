# Gantree Core - Development Background

## Layout

### Entry Points

gantree-core is the result of merging two previous projects, gantree-cli and gantree-lib

gantree-core is still able to function as both a library if imported and provides binaries via npm or npx usage

For the current library api see other documentation or `./src/lib/index.js`

For the current cli binaries see other documentation or `./package.json -> "bin" section`

**./docs**

Contains various project documentation, these files may be linked to in github

**./examples**

Some scripts to test the library aspect of gantree-core directly, these may no longer be userful

**./tests**

Some scripts to test the reconfig aspect of gantree-core directly, these may no longer be useful

**./src**

Source code

This includes gantree-cli, gantree-lib, lib-modules (V2, V3, V4), support libraries, utilities, 

**./src/cli/gantree-cli**

Main cli entrypoint, arguments and environment variable processing

**./src/cli/toos-cli**

Entrypoints/wrappers for cli tools bundled and exposed by gantree-core package

**./src/tools**

Source code for helper tools bundled with gantree-core, some of which are availible as cli binaries

**./src/package**

Runtime meta information about the library/cli package

**./src/lib**

Gantree-core library source

**./src/lib/error**

The standard error thrown by gantree-lib

Shared by all lib versions

Exposed by the library API, client applications may want to behave differently depending on the error

**./src/lib/logging**

The common logger used by gantree-lib

Shared by all lib versions

Exposed by the library API, applications using gantree-core as a library need to pass in a compatible winston logger, the included builder functions can help with this, see `./src/cli/gantree-cli/commands/command-args.js` for an example of using Logger.create()

**./src/lib/utils**

Small helper utilities shared by all lib versions, mainly provided for consistency around IO, paths, etc
