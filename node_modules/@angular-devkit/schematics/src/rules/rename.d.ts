/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Rule } from '../engine/interface';
import { FilePredicate } from '../tree/interface';
export declare function rename(match: FilePredicate<boolean>, to: FilePredicate<string>): Rule;
