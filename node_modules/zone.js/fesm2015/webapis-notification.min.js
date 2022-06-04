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
 */Zone.__load_patch("notification",((t,o,r)=>{const e=t.Notification;if(!e||!e.prototype)return;const n=Object.getOwnPropertyDescriptor(e.prototype,"onerror");n&&n.configurable&&r.patchOnProperties(e.prototype,null)}));