# pwix:tabular

## What is it ?

A Meteor package which encapsulates `aldeed:tabular` to force the homogeneity of tabular presentations inside of our applications.

In particular, this package let the caller add (or not) three `Information`, `Edit` and `Delete` buttons at the end right of each row.

## Installation

This Meteor package is installable with the usual command:

```sh
    meteor add pwix:tabular
```

## Usage

In your .html template, use `tabular_ext` template instead of `tabular`, with just the same parameters.

## Provides

### `Tabular`

The exported `Tabular` global object provides following items:

#### Functions

##### `Tabular.configure( o<Object> )`

See [below](#configuration)

##### `Tabular.i18n.namespace()`

Returns the i18n namespace used by the package. Used to add translations at runtime.

Available both on the client and the server.

#### Classes

##### `Tabular.Table`

This package `Tabular.Table` class extends the `aldeed:tabular` `Tabular.Table` class.

The constructor accepts all `aldeed:tabular` `Tabular.Table` own options, plus following additional parameters, all inside a `tabular` object:

- `tabular.deleteConfirmationText`

    The text to be displayed when requiring the user confirmation, as a HTML string.

    Defaults to 'Deleting an object'.

- `tabular.deleteConfirmationTitle`

    The title of the confirmation modal dialog.

    Defaults to 'You are about to delete the "%s" object. Are you sure ?'.

- `tabular.deleteButtonEnabled`

    Whether the 'Delete' button must be enabled, with a truethy or falsy value.

    Defaults to `true` (enabled).

- `tabular.deleteButtonTitle`

    The title of the 'Delete' button.

    Defaults to 'Delete the "%s" object'.

- `tabular.dialogClasses`

    The classes to be added to the displayed dialogs, as a string.

    Defaults to nothing.

- `tabular.editButtonEnabled`

    Whether the 'Edit' button must be enabled, with a truethy or falsy value.

    Defaults to `true` (enabled).

- `tabular.editButtonTitle`

    The title of the 'Edit' button.

    Defaults to 'Edit the "%s" object'.

- `tabular.infoButtonEnabled`

    Whether the 'Information' button must be enabled, with a truethy or falsy value.

    Defaults to `true` (enabled).

- `tabular.infoButtonTitle`

    The title of the 'Information' button.

    Defaults to 'Informations about the "%s" object'.

- `tabular.wantDeleteConfirmation`

    Whether the `tabular-delete-event` event must be triggered after a user confirmation (if `true`) or as soon as the user has clicked on the `Delete` button (if `false`).

    Defaults to `true` (after user confirmation).

- `tabular.withDeleteButton`

    Whether to display a 'Delete' button on the right, defaulting to `true`

- `tabular.withEditButton`

    Whether to display an 'Edition' button on the right, defaulting to `true`

- `tabular.withInfoButton`

    Whether to display an 'Information' button on the right, defaulting to `true`

All parameters can be provided as values, or as functions. The provided  function will be called with the row object, and must return the desired value.

Please note that buttons are managed inside of autorun functions. So the package will be reactive to the changes if you provide here reactive data sources.

As its `aldeed:tabular` ancestor, this package requires that the `Table` constructor be called in same terms, both in client and server side.

## Configuration

The package's behavior can be configured through a call to the `Tabular.configure()` method, with just a single javascript object argument, which itself should only contains the options you want override.

Known configuration options are:

- `hideDisabled`

    Whether to hide disabled buttons instead of displaying the disabled state.

    Defaults to `true`: disabled buttons are hidden.

- `verbosity`

    Define the expected verbosity level.

    The accepted value can be any or-ed combination of following:

    - `Tabular.C.Verbose.NONE`

        Do not display any trace log to the console

    - `Tabular.C.Verbose.CONFIGURE`

        Trace `Tabular.configure()` calls and their result

Please note that `Tabular.configure()` method should be called in the same terms both in client and server sides.

Remind too that Meteor packages are instanciated at application level. They are so only configurable once, or, in other words, only one instance has to be or can be configured. Addtionnal calls to `Tabular.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

## NPM peer dependencies

Starting with v 1.0.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`.

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.0.0:

```js
    'lodash': '^4.17.0',
```

Each of these dependencies should be installed at application level:

```sh
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-tabular/pulls).

## Cookies and comparable technologies

None at the moment.

## Issues & help

In case of support or error, please report your issue request to our [Issues tracker](https://github.com/trychlos/pwix-tabular/issues).

---
P. Wieser
- Last updated on 2024, Jun. 21st
