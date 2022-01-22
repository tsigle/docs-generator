# docs-generator

Reads connector manifest file and generates markdown docs.

## Before you begin

This script was tested on `node.js` v.14.0.0 using `nvm`.

- Run `nvm use v.14.0.0`.

Add the packages using the `yarn` package manager. If you prefer, `npm` also works.

- Run `yarm install` or `npm install`.

## Important

- Ensure you know the location of the `manifest` folder.

    **For example**: a local file location: `../microservice-pingone-sso/manifest`

- **Note**: If the folder does not contain an `index.js` file, then specify the name of the manifest file.

  **For example**: `../microservice-pingone-sso/manifests/manifest.js`

## To process a manifest location specified in the code

1. In `generate_docs.js`, point the `manifest` constant to your local file.

    **For example**: `const manifest = require(../microservice-pingone-sso/manifest)`

1. Run the generator script (should be automated in a build pipeline).

    **For example**: `node generate_docs.js`
## To process a manifest provided by the command line.

1. In `generate_docs.js`, point the `manifest` constant to use a command line argument.

    **For example**: `const manifest = require(process.argv[2])`

1. Run the generator script with the name of the manifest folder/file.

    **For example**: `node generate_docs.js ../microservice-pingone-sso/manifest`
  
## Output files

TO DO: Add output info here


