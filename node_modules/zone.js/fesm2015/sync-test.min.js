"use strict";
/**
 * @license Angular v14.0.0-next.5
 * (c) 2010-2022 Google LLC. https://angular.io/
 * License: MIT
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */class SyncTestZoneSpec{constructor(e){this.runZone=Zone.current,this.name="syncTestZone for "+e}onScheduleTask(e,s,c,n){switch(n.type){case"microTask":case"macroTask":throw new Error(`Cannot call ${n.source} from within a sync test.`);case"eventTask":n=e.scheduleTask(c,n)}return n}}Zone.SyncTestZoneSpec=SyncTestZoneSpec;