# pwix:tabular-ext

## What is it ?

A Meteor package which encapsulates `aldeed:tabular` to force the homogeneity of tabular presentations inside of our applications.

In particular, this package let the caller add (or not) three information, edit and delete buttons at the end right of each row.

## Usage

In our .html template, use tabular_ext instead of tabular, with just the same parameters.

## Provides

The package provides a single `TabularExt` class which extends the `aldeed:tabular` `Tabular.Table` class.

The constructor accepts following additional parameters, all inside a `tabular_ext` object:

- `tabular_ext.deleteConfirmationText`

    The text to be displayed when requiring the user confirmation, as a HTML string.

    Can be a function which will be called with the row object, and must return the text.

    Defaults to 'Deleting an object'.

- `tabular_ext.deleteConfirmationTitle`

    The title of the confirmation modal dialog.

    Can be a function which will be called with the row object, and must return the title.

    Defaults to 'You are about to delete the "%s" object. Are you sure ?'.

- `tabular_ext.deleteButtonEnabled`

    Whether the 'Delete' button must be enabled, with a truethy or falsy value.

    Can be a function which will be called with the row object, and must return true|false to enable the 'Delete' button.

    Defaults to `true` (enabled).

- `tabular_ext.deleteButtonTitle`

    The title of the 'Delete' button.

    Can be a function which will be called with the row object, and must return the title to be attached to the 'Delete' button.

    Defaults to 'Delete the "%s" object'.

- `tabular_ext.dialogClasses`

    The classes to be added to the displayed dialogs, as a string.

    Can be a function which will be called with the row object, and must return the classes string.

    Defaults to nothing.

- `tabular_ext.editButtonEnabled`

    Whether the 'Edit' button must be enabled, with a truethy or falsy value.

    Can be a function which will be called with the row object, and must return true|false to enable the 'Edit' button.

    Defaults to `true` (enabled).

- `tabular_ext.editButtonTitle`

    The title of the 'Edit' button.

    Can be a function which will be called with the row object, and must return the title to be attached to the 'Edit' button.

    Defaults to 'Edit the "%s" object'.

- `tabular_ext.infoButtonEnabled`

    Whether the 'Information' button must be enabled, with a truethy or falsy value.

    Can be a function which will be called with the row object, and must return true|false to enable the 'Information' button.

    Defaults to `true` (enabled).

- `tabular_ext.infoButtonTitle`

    The title of the 'Information' button.

    Can be a function which will be called with the row object, and must return the title to be attached to the 'Information' button.

    Defaults to 'Informations about the "%s" object'.

- `tabular_ext.wantDeleteConfirmation`

    Whether the `tabular-ext-delete-event` event must be triggered after a user confirmation (if `true`) or as soon as the user has clicked on the `Delete` button (if `false`).

    Defaults to `true` (after user confirmation).

- `tabular_ext.withDeleteButton`

    whether to display a 'Delete' button on the right, defaulting to true

- `tabular_ext.withEditButton`

    whether to display an 'Edition' button on the right, defaulting to true

- `tabular_ext.withInfoButton`

    whether to display an 'Information' button on the right, defaulting to true

As its `aldeed:tabular` ancestor, this package requires that the constructor be called in same terms, both in client and server side.

---
P. Wieser
- Last updated on 2023, June 5th
