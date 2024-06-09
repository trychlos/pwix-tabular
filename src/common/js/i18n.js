/*
 * pwix:tabular-ext/src/common/js/global.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../i18n/en.js';
pwixI18n.namespace( I18N, 'en', TabularExt.i18n.en );

import '../i18n/fr.js';
pwixI18n.namespace( I18N, 'fr', TabularExt.i18n.fr );

TabularExt.i18n.namespace = function(){
    return I18N;
};
