/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/core/schematics/migrations/router-link-empty-expression/analyze_template" />
import type { TmplAstBoundAttribute } from '@angular/compiler';
import { ResolvedTemplate } from '../../utils/ng_component_template';
export declare function analyzeResolvedTemplate(template: ResolvedTemplate, compilerModule: typeof import('@angular/compiler')): TmplAstBoundAttribute[] | null;
