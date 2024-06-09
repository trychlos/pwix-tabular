# pwix:tabular-ext

## What is it ?

A Meteor package which encapsulates `aldeed:tabular` to force the homogeneity of tabular presentations inside of our applications.

In particular, this package let the caller add (or not) three information, edit and delete buttons at the end right of each row.

## Usage

In our .html template, use tabular_ext instead of tabular, with just the same parameters.

## Provides

The package provides a single `TabularExt` class which extends the `aldeed:tabular` `Tabular.Table` class.

The constructor accepts following additional parameters, all inside a `tabular_ext` object:

- `tabular_ext.deleteButtonEnabled`

    A function which will be called with the row object, and must return true|false to enable the 'Delete' button.

    Default to always enabled.

- `tabular_ext.deleteButtonTitle`

    A function which will be called with the row object, and must return the title to be attached to the 'Delete' button.

    Default to 'Delete the "%s" object'.

- `tabular_ext.editButtonEnabled`

    A function which will be called with the row object, and must return true|false to enable the 'Edit' button.

    Default to always enabled.

- `tabular_ext.editButtonTitle`

    A function which will be called with the row object, and must return the title to be attached to the 'Edit' button.

    Default to 'Edit the "%s" object'.

- `tabular_ext.infoButtonEnabled`

    A function which will be called with the row object, and must return true|false to enable the 'Information' button.

    Default to always enabled.

- `tabular_ext.infoButtonTitle`

    A function which will be called with the row object, and must return the title to be attached to the 'Information' button.

    Default to 'Information about the "%s" object'.

- `tabular_ext.withDeleteButton`

    whether to display a 'Delete' button on the right, defaulting to true

- `tabular_ext.withEditButton`

    whether to display an 'Edition' button on the right, defaulting to true

- `tabular_ext.withInfoButton`

    whether to display an 'Information' button on the right, defaulting to true

---
P. Wieser
- Last updated on 2023, June 5th
