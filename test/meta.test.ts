import { describe, expect, it } from 'vitest';
import {
  API_REFERENCE,
  findMethod,
  getModule,
  hasMethod,
  hasModule,
  listMethods,
  listModules,
} from '../src/meta';
import { SDS } from '../src/client';
import { SDS_MODULES, SDS_REFERENCE_VERSION } from '../src/generated/meta';

describe('bundled metadata', () => {
  it('covers every module of the reference', () => {
    const modules = listModules();
    expect(modules.length).toBe(22);
    expect(modules.map((module) => module.id)).toEqual(SDS_MODULES.map((module) => module.id));
    for (const module of modules) {
      expect(hasModule(module.id)).toBe(true);
      expect(getModule(module.id)?.key).toBeTruthy();
      expect(module.methods.length).toBeGreaterThan(0);
    }
  });

  it('covers all 285 methods with routes and params metadata', () => {
    const methods = listMethods();
    expect(methods.length).toBe(285);
    for (const method of methods) {
      expect(method.path.startsWith('/')).toBe(true);
      expect(method.path).toContain(method.module);
      expect(typeof method.description).toBe('string');
      expect(Array.isArray(method.params)).toBe(true);
      expect(hasMethod(method.module, method.name)).toBe(true);
      expect(hasMethod(`${method.module}.${method.name}`)).toBe(true);
    }
  });

  it('finds methods by key and by two arguments', () => {
    const byKey = findMethod('chain_api.getConfig');
    const byPair = findMethod('chain_api', 'getConfig');
    expect(byKey).toBe(byPair);
    expect(byKey?.params).toEqual([]);
    expect(findMethod('chain_api', 'doesNotExist')).toBeUndefined();
    expect(findMethod('does_not_exist')).toBeUndefined();
  });

  it('every route template token matches a declared parameter', () => {
    for (const method of listMethods()) {
      const tokens = method.path.match(/:([A-Za-z_][A-Za-z0-9_]*)(\??)/g) ?? [];
      const names = tokens.map((token) => token.slice(1).replace(/\?$/, ''));
      expect(names).toEqual(method.params.map((param) => param.name));
    }
  });

  it('exposes the reference version and an API_REFERENCE constant', () => {
    expect(API_REFERENCE.version).toBe(SDS_REFERENCE_VERSION);
    expect(API_REFERENCE.modules.length).toBe(22);
    expect(new Date(API_REFERENCE.scrapedAt).getTime()).toBeGreaterThan(0);
  });
});

describe('introspection through the client', () => {
  const sds = new SDS({ fetch: async () => new Response('{}', { status: 200 }) });

  it('listModules / listMethods mirror the module functions', () => {
    expect(sds.listModules().length).toBe(22);
    expect(sds.listMethods().length).toBe(285);
    expect(sds.listMethods('chain_api').every((method) => method.module === 'chain_api')).toBe(true);
    expect(sds.listMethods('nope_api')).toEqual([]);
  });

  it('describeMethod returns a defensive copy', () => {
    const meta = sds.describeMethod('chain_api.getAccountNames');
    expect(meta).toBeDefined();
    expect(meta?.params[0].name).toBe('limit');
    meta!.params[0].name = 'mutated';
    expect(sds.describeMethod('chain_api.getAccountNames')?.params[0].name).toBe('limit');
    expect(sds.describeMethod('chain_api', 'nope')).toBeUndefined();
  });

  it('hasMethod works with both signatures', () => {
    expect(sds.hasMethod('chain_api.getConfig')).toBe(true);
    expect(sds.hasMethod('chain_api', 'getConfig')).toBe(true);
    expect(sds.hasMethod('chain_api.getNothing')).toBe(false);
  });

  it('reference version is exposed', () => {
    expect(sds.referenceVersion).toBe(SDS_REFERENCE_VERSION);
    expect(sds.referenceSource).toContain('http');
  });
});
