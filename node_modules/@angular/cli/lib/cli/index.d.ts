/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export { VERSION, Version } from '../../models/version';
export default function (options: {
    testing?: boolean;
    cliArgs: string[];
}): Promise<number>;
