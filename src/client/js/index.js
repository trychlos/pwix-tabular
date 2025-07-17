/*
 * pwix:tabular/src/client/js/index.js
 */

import { default as alTabular } from 'meteor/aldeed:tabular';

// import here templates addressed by the  Tabular class
import '../components/dt_buttons/dt_buttons.js';
import '../components/dt_checkbox/dt_checkbox.js';
import '../components/dt_last_update/dt_last_update.js';

// before importing the class itself
import '../../common/js/index.js';

// mutualize the datatable imports
import DataTables from 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.colVis.mjs';
import 'datatables.net-buttons/js/buttons.print.mjs';
import 'datatables.net-colreorder-bs5';
import 'datatables.net-fixedheader-bs5';
import 'datatables.net-responsive-bs5';
import 'datatables.net-rowgroup-bs5';
import 'datatables.net-scroller-bs5';
//
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css';
import 'datatables.net-colreorder-bs5/css/colReorder.bootstrap5.min.css';
import 'datatables.net-fixedheader-bs5/css/fixedHeader.bootstrap5.min.css';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';
import 'datatables.net-rowgroup-bs5/css/rowGroup.bootstrap5.min.css';
import 'datatables.net-scroller-bs5/css/scroller.bootstrap5.min.css';
//
import '../stylesheets/tabular.less';
//
alTabular.init({ DataTables });
