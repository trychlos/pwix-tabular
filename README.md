# pwix:tabular

## What is it ?

A Meteor package which encapsulates `aldeed:tabular` to force the homogeneity of tabular presentations inside of our applications.

In particular, this package let the caller add (or not) three `Information`, `Edit` and `Delete` buttons at the end right of each row.

## Installation

This Meteor package is installable with the usual command:

```sh
    meteor add pwix:tabular
    meteor npm install datatables.net-bs5 datatables.net-buttons-bs5 datatables.net-colreorder-bs5 datatables.net-fixedheader-bs5 datatables.net-plugins datatables.net-responsive-bs5 datatables.net-rowgroup-bs5 datatables.net-scroller-bs5 lodash strftime --save
```

And to run the tests suite:
```sh
    meteor add meteortesting:mocha lmieulet:meteor-coverage
    meteor npm install chai sinon --save-dev
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

The constructor accepts all `aldeed:tabular` `Tabular.Table` own options, plus following additional parameters inside of a `pwix` object:

- `pwix.buttons`

    An object which describes additional buttons to be set before or after standard info, edit, delete buttons.

    This is an array of objects, where each object has following keys:

    - `where`: whether to insert before or after the standard buttons, with values:

        - `Tabular.C.Where.BEFORE`
        - `Tabular.C.Where.AFTER`
    
    - `buttons`: an array of Blaze template names to be added at the place.

- `pwix.deleteConfirmationText`

    The text to be displayed when requiring the user confirmation, as a HTML string.

    Defaults to 'You are about to delete the "%s" object. Are you sure ?'.

- `pwix.deleteConfirmationTitle`

    The title of the confirmation modal dialog.

    Defaults to 'Deleting an object'.

- `pwix.deleteButtonEnabled`

    Whether the 'Delete' button must be enabled, with a truethy or falsy value.

    Defaults to `true` (enabled).

- `pwix.deleteButtonTitle`

    The title of the 'Delete' button.

    Defaults to 'Delete the "%s" object'.

- `pwix.deleteItem`

    The object to be deleted.

    Defaults to the row data object.

- `pwix.dialogClasses`

    The classes to be added to the displayed dialogs, as a string.

    Defaults to nothing.

- `pwix.editButtonEnabled`

    Whether the 'Edit' button must be enabled, with a truethy or falsy value.

    Defaults to `true` (enabled).

- `pwix.editButtonTitle`

    The title of the 'Edit' button.

    Defaults to 'Edit the "%s" object'.

- `pwix.editItem`

    The object to be edited.

    Defaults to the row data object.

- `pwix.infoButtonEnabled`

    Whether the 'Information' button must be enabled, with a truethy or falsy value.

    Defaults to `true` (enabled).

- `pwix.infoButtonTitle`

    The title of the 'Information' button.

    Defaults to 'Informations about the "%s" object'.

- `pwix.infoItem`

    The object to be used when displaying informations.

    Defaults to the row data object.

- `pwix.infoModalTitle`

    The title of the 'Information' modal.

    Defaults to 'Informations'.

- `pwix.wantDeleteConfirmation`

    Whether the `tabular-delete-event` event must be triggered after a user confirmation (if `true`) or as soon as the user has clicked on the `Delete` button (if `false`).

    Defaults to `true` (after user confirmation).

- `pwix.withDeleteButton`

    Whether to display a 'Delete' button on the right, defaulting to `true`.

- `pwix.withEditButton`

    Whether to display an 'Edition' button on the right, defaulting to `true`.

- `pwix.withInfoButton`

    Whether to display an 'Information' button on the right, defaulting to `true`.

- `pwix.withSettingsButton`

    Let the user edit tabular settings (ordering and visibility of the columns for example). The user settings are stored in local storage as a functional cookie that the user must have previously accepted.

    The settings menu button is put on the header cell of the last column, which typically is the additional buttons column. It is not created if there is no button at all.

    The option defaults to `true`.

- `pwix.withSettingsItems`

    This option is deprecated in v1.8.

All parameters can be provided as values, or as async functions. The provided function will be called with the row object, and must return the desired value.

Please note that buttons are managed inside of autorun functions. So the package will be reactive to the changes if you provide here reactive data sources.

As its `aldeed:tabular` ancestor, this package requires that the `Table` constructor be called in same terms, both in client and server side.

NB: the constructor used to use a `tabular` sub-object until v1.6 instead of the new `pwix`. This usage has since been deprecated starting with v1.7.

### Components

#### `dt_checkbox`

A component to display a checkbox in the tabular view. It honors following data context:

- `item`: the row data
- `field`: the `Field.Def` definition
- `enabled`: a Boolean, or a ReactiveVar or a function which returns a Boolean or a ReactiveVar, defaulting to true
- `readonly`: a Boolean, or a ReactiveVar or a function which returns a Boolean or a ReactiveVar, defaulting to true
- `onCheck`: a function called with the 'checked' prop.

#### `dt_last_update`

A component to display the last update timestamp in the tabular view. It honors following data context:

- `item`: the row data.

If the item has already been updated, then the last update date and time and author are displayed. Else the creation date and time and author are used as a fallback.

## Triggered events

The package triggers following events:

- `tabular-click-event` with data `{ item, field, checked }`, where `item` is the item corresponding to the displayed row, and `field` the relevant `Field.Def` instance,

- `tabular-delete-event` with data `{ item, table }`, where `item` is the item corresponding to the displayed row,

- `tabular-edit-event` with data `{ item, table }`, where `item` is the item corresponding to the displayed row,

- `tabular-info-event` with data `{ item, table }`, where `item` is the item corresponding to the displayed row,

- `tabular-settings-event` with data `{ item, table }`, where `item` is the item selected in the dropdown menu.

- `tabular-settings-changed` when the settings have been modified.

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

`Tabular.configure()` is a reactive data source.

## NPM peer dependencies

Starting with v 1.0.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`.

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.8.0:

```js
    'datatables.net-bs5': '^2.0.8',
    'datatables.net-buttons-bs5': '^3.0.2',
    'datatables.net-colreorder-bs5': '^2.0.3',
    'datatables.net-fixedheader-bs5': '^4.0.1',
    'datatables.net-plugins': '^2.3.6',
    'datatables.net-responsive-bs5': '^3.0.2',
    'datatables.net-rowgroup-bs5': '^1.5.0',
    'datatables.net-scroller-bs5': '^2.4.3',
    'lodash': '^4.17.0',
    'strftime': '^0.10.0'
```

Each of these dependencies should be installed at application level:

```sh
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-tabular/pulls).

## Cookies and comparable technologies

`pwix:tabular` may use `localStorage` to record some valuable data.

### `pwix:tabular/tabular-columns/<tabularName>`

The chosen list and order of the visible columns when displaying the named tabular list.

This is considered a disableable functional _cookie_, and is advertised as such to the CookieManager if present.

### `pwix:tabular/rows-per-page/<tabularName>`

The chosen rows count per page when displaying the named tabular list.

This is considered a disableable functional _cookie_, and is advertised as such to the CookieManager if present.

## Issues & help

In case of support or error, please report your issue request to our [Issues tracker](https://github.com/trychlos/pwix-tabular/issues).

---
P. Wieser
- Last updated on 2026, Apr. 23rd
