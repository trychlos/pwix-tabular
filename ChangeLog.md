# pwix:tabular

## ChangeLog

### 1.8.0

    Release date: 2026- 4-23

    - Define new Table.editTabularSettings() method
    - Define new Tabular.getSettingsColumns() function
    - Define new Tabular.indexMap() function
    - Define new Tabular.applyState() function
    - Deprecate 'withSettingsItems' instanciation option in favor of 'withSettingsButton'
    - Internalize all settings update and apply so that all the logic is self-contained in the package
    - Keep and restore the count of rows per page (todo #4)
    - Install corReorder default drag-and-drop, fixing the way columns are counted

### 1.7.1

    Release date: 2026- 4-17

    - Improve and document the 'dt_checkbox' component
    - Transform pwix:accounts-core into a weak dependency, as it is only used to display the user preferred label in dt_last_update component

### 1.7.0

    Release date: 2026- 4- 2

    - configure() now warns for unmanaged keys
    - Fix tabular.less to no more show scrollbars (most probably to be reviewed when we will have more content to display)
    - Define new 'withSettingsItems' which let display a dropdown menu in the rightmost header cell, thus bumping minor candidate version number
    - Rename the 'tabular' sub-object of Table constructor options to 'pwix'
    - Initialize a tests suite
    - Use pwix:logger universal logger
    - Fix DataTables dt-container display style to be visible below dropdown menus
    - Private Table._setCheckboxes() method is renamed _setTemplatesFromStrings() and is more extensible
    - Add datatables.net-plugins NPM dependency
    - Replace assertions par logger.error() + exception throw
    - Take care of having a deep data context copy for each button
    - Rename pwix:accounts-hub dependency to pwix:accounts-core, upgrading it to 2.0.0-rc.0

### 1.6.0

    Release date: 2026- 2- 9

    - Initialize the aldeed:tabular package (but how dit it work before !?)
    - Define new dt_last_update component, thus bumping minor candidate version number

### 1.5.2

    Release date: 2024-11-19

    - Fix comment spelling

### 1.5.1

    Release date: 2024-10- 4

    - Fix configuration overrides
    - Fix the item addressing on edit/delete buttons

### 1.5.0

    Release date: 2024- 9-13

    - Define 'onCheck()' new data context property for dt_checkbox component, thus bumping minor candidate version number

### 1.4.0

    Release date: 2024- 8-11

    - Accepts a null collection (and application-provided data) thus bumping minor candidate version number
    - Fix the width computing on a tabbed modal

### 1.3.0

    Release date: 2024- 7-16

    - Fix delete confirmation modal text
    - Add missing datatables.net dependencies
    - Let the caller insert buttons before or after standard ones, bumping minor candidate version number

### 1.2.0

    Release date: 2024- 7- 1

    - Let the caller install a checkbox template on boolean values, bumping minor candidate version number
    - Tabular.configure() becomes a reactive data source
    - Buttons now accept a function to return the object to be used
    - Make sure all function are managed as async functions

### 1.1.0

    Release date: 2024- 6-24

    - Define configure() new function, bumping minor candidate version number
    - Introduce hideDisabled configuration
    - Introduce stylesheet
    - Takes care of forcing the table to expand even if initialized while  hidden
    - Have the three buttons in a single column

### 1.0.0

    Release date: 2024- 6-21

    - Initial release

---
P. Wieser
- Last updated on 2026, Apr. 23rd
