# docs-generator
Generates Docs from Manifest file

## Before you begin

Peter: I used node.js 16 through `nvm` and the `yarn` package manager. But `npm` works as well.

1. Run `nvm use lts/gallium`.

1. Run `yarm install` or `npm install`.

1. Ensure you know the location of the `manifest` folder.

    For example: `../microservice-pingone-sso/manifest`
1. Run `node install.js <name of manifest folder/file>`

    For example: `node install.js ../microservice-pingone-sso/manifest`

    **Note**: If the folder does not contain an `index.js` file, then specify the name of the manifest file.
    For example: `../template-simple-connector/manifests/manifest.js`




