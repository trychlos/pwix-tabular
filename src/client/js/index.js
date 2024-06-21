/*
 * pwix:tabular/src/client/js/index.js
 */

// mutualize the datatable imports
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.colVis.mjs';
import 'datatables.net-buttons/js/buttons.print.mjs';
import 'datatables.net-colreorder-bs5';
import 'datatables.net-fixedheader-bs5';
import 'datatables.net-responsive-bs5';
import 'datatables.net-scroller-bs5';
//
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css';
import 'datatables.net-colreorder-bs5/css/colReorder.bootstrap5.min.css';
import 'datatables.net-fixedheader-bs5/css/fixedHeader.bootstrap5.min.css';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';
import 'datatables.net-scroller-bs5/css/scroller.bootstrap5.min.css';

// import templates before defining the TabularExt class (which need them)
import '../components/delete_btn/delete_btn.js';
import '../components/edit_btn/edit_btn.js';
import '../components/info_btn/info_btn.js';
//
import '../../common/js/index.js';
