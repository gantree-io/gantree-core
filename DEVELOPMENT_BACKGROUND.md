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

**./src/lib/v2 ./src/lib/v3 ./src/lib/v4**

Internal lib version source code

Lib version is selected via the gantree configuration json file -> "metadata" -> "version" field, see `./src/lib/gantree.js` for more

**./src/lib/v2**

First rewrite and modularization of the internal lib logic was into v2

**./src/lib/v2/core**

Entrypoint for v2 internal lib, code relating to running commands, creating inventories, creating a frame (run-context), and running ansible commands

**./src/lib/v2/playbooks**

Ansible playbooks activated by core

**./src/lib/v2/providers**

Modularized code for interating with cloud/infrastructure providers, eg. gcp, aws, do

**./src/lib/v2/reconfig**

Code flows used for deterministically generating ansible inventories from provided gantree config json

Inventories act as the entrypoint from core

Inventories leverage extractors to get information from the config json

Extractors may collectin information from the config json or other extractors

Inventory, extractors and preprocessors should return data but should not cause mutation to input data or cause side effects other than throwing errors

**./src/lib/v2/services**

Helper functions specific to the internal lib

**./src/lib/v3**

v3 moved business logic out of ansible playbooks and into reconfig. This allowed the ansible playbooks to be simplified and meant business logic was all in one place making it easier to maintain

**./src/lib/v4**

v4 made ansible responsible for running reconfig via the dynamic inventory. This made reconfig much more powerful as it was able to access the ansible state dyanmically each time it was run (when ansible calls 'setup' either implicitly or explicitly).

While this worked and is extremely powerful, it was pretty hacky to implement and required writing the frame to an intermediate file so that it was availabe when ansible dynamically runs reconfig. An alternate option might be to rewrite reconfig into an ansiblble dyanmic inventory module, similare to 'compose', although this would be a non-trivial amount of work
