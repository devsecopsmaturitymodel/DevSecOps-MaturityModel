import { TestBed } from '@angular/core/testing';
import { YamlService } from './yaml-loader.service';
import { parse } from 'yamljs';

describe('YamlLoaderService', () => {
  let service: YamlService;
  const mockMetaYaml = `
    name: Me
    references:
      teams: "CORRECT"
    teams:
      $ref: "#/references/teams"
    external_ref:
      $ref: "external.yaml#/external/ref2"
`;

  const mockReferencedYaml = `
    external:
      ref1: "REF 1"
      ref2: "REF 2"
`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YamlService],
    });
    service = TestBed.inject(YamlService);
    (service as any)._refs['/external.yaml'] = parse(mockReferencedYaml);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should substitute $ref in meta', async () => {
    let yaml = parse(mockMetaYaml);

    await service.substituteYamlRefs(yaml, '.');

    expect(yaml.name).toBe('Me');
    expect(yaml.teams).toBe('CORRECT');
    expect(yaml.external_ref).toBe('REF 2');
  });

  it('should throw error when $ref not found', async () => {
    let yaml = parse(mockMetaYaml);
    yaml['not-found'] = { $ref: '#/references/not-there' };
    console.log('PRE:\n' + JSON.stringify(yaml));
    try {
      await service.substituteYamlRefs(yaml, '.');
      expect('substituteYamlRefs()').toThrowError('Should not get here');
    } catch (error) {
      expect(String(error)).toEqual("Error: Cannot find 'references/not-there' in yaml file");
    }
  });
});
