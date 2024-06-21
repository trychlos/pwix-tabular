/*
 * pwix:tabular/src/common/js/global.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../i18n/en.js';
pwixI18n.namespace( I18N, 'en', Tabular.i18n.en );

import '../i18n/fr.js';
pwixI18n.namespace( I18N, 'fr', Tabular.i18n.fr );

Tabular.i18n.namespace = function(){
    return I18N;
};
