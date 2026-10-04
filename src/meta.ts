/**
 * Runtime metadata lookup over the generated reference.
 */
import {
  SDS_MODULES,
  SDS_REFERENCE_DATE,
  SDS_REFERENCE_SOURCE,
  SDS_REFERENCE_VERSION,
} from './generated/meta';
import type { SDSApiReference, SDSMethodMeta, SDSModuleMeta } from './meta-types';

const modulesById = new Map<string, SDSModuleMeta>(SDS_MODULES.map((module) => [module.id, module]));

const methodsByKey = new Map<string, SDSMethodMeta>();
for (const module of SDS_MODULES) {
  for (const method of module.methods) {
    methodsByKey.set(`${module.id}.${method.name}`, method);
  }
}

/** All modules of the reference (copies). */
export function listModules(): SDSModuleMeta[] {
  return SDS_MODULES.map((module) => ({ ...module, methods: [...module.methods] }));
}

/** All methods, or the methods of a single module (copies). */
export function listMethods(moduleId?: string): SDSMethodMeta[] {
  if (moduleId === undefined) {
    return SDS_MODULES.flatMap((module) => module.methods.map((method) => ({ ...method })));
  }
  const module = modulesById.get(moduleId);
  return module ? module.methods.map((method) => ({ ...method })) : [];
}

/** Looks a module up by id (`chain_api`). */
export function getModule(moduleId: string): SDSModuleMeta | undefined {
  return modulesById.get(moduleId);
}

/**
 * Looks a method up by `'chain_api.getAccountNames'` or by
 * `('chain_api', 'getAccountNames')`.
 */
export function findMethod(moduleIdOrKey: string, method?: string): SDSMethodMeta | undefined {
  const key = method === undefined ? moduleIdOrKey : `${moduleIdOrKey}.${method}`;
  return methodsByKey.get(key);
}

/** Whether the given module id exists in the bundled reference. */
export const hasModule = (moduleId: string): boolean => modulesById.has(moduleId);

/** Whether the given method exists (accepts both lookup forms of {@link findMethod}). */
export function hasMethod(moduleIdOrKey: string, method?: string): boolean {
  return findMethod(moduleIdOrKey, method) !== undefined;
}

export {
  SDS_MODULES,
  SDS_REFERENCE_DATE,
  SDS_REFERENCE_SOURCE,
  SDS_REFERENCE_VERSION,
};

/** The full bundled reference (metadata + provenance), useful for tooling. */
export const API_REFERENCE: SDSApiReference = {
  source: SDS_REFERENCE_SOURCE,
  version: SDS_REFERENCE_VERSION,
  scrapedAt: SDS_REFERENCE_DATE,
  modules: SDS_MODULES,
};
