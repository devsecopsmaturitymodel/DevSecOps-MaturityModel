import { Injectable } from '@angular/core';
import {
  parse as parseSingle,
  parseAllDocuments as parseMultiple,
  stringify as yamlStringify,
} from 'yaml';
import { perfNow } from 'src/app/util/util';

@Injectable({ providedIn: 'root' })
export class YamlService {
  private _refs: Record<string, any>;

  constructor() {
    this._refs = {};
  }

  public parse(yamlStr: string): any {
    return parseSingle(yamlStr, { schema: 'yaml-1.1' });
  }

  public parseMultiple(yamlStr: string): any {
    let docs = parseMultiple(yamlStr, { schema: 'yaml-1.1' });
    return docs.map(doc => doc.toJS());
  }

  public stringify(yamlObj: any): string {
    return yamlStringify(yamlObj);
  }

  public stringifyMultiple(yamlObj: any[]): string {
    throw Error('NOT YET IMPLEMENTED');
    return yamlStringify(yamlObj);
  }

  /**
   * Loads and swaps any '$ref' references.
   *
   * @param url The relative path to the yaml file
   * @returns The yaml object
   */
  public async loadYamlWithReferencesResolved(url: string): Promise<any> {
    let yaml = await this.loadYaml(url);

    const referenceUrl = url;
    await this.substituteYamlRefs(yaml, referenceUrl);

    return yaml;
  }

  /**
   *  Load a yaml file, and convert it to an object
   */
  public async loadYaml(url: string, multipleDocs: boolean = false): Promise<any> {
    const timeStart: Date = new Date();
    console.debug(`${perfNow()}: YAML: Fetching ${url}`);
    const response: Response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch the '${url}' YAML file: ${response.statusText}`);
    }
    const yamlText: string = await response.text();
    const timeFetched: Date = new Date();
    console.debug(`${perfNow()}: YAML: Retrieved ${url}`);

    let yaml: any;
    if (multipleDocs) {
      yaml = this.parseMultiple(yamlText);
    } else {
      yaml = this.parse(yamlText);
    }
    const timeParsed: Date = new Date();
    console.debug(`${perfNow()}: YAML: Parsed ${url}`);
    console.log(`${perfNow()}: YAML: Fetched ${url}: load: ${timeFetched.getTime() - timeStart.getTime()} ms, parse: ${timeParsed.getTime() - timeFetched.getTime()} ms`); // eslint-disable-line
    return yaml;
  }

  /**
   * Substitute any '$ref' with the content of the reference
   *
   * @param yaml The original yaml object
   * @param referencePath Path to the yaml file, used as reference when loading other yaml
   * @returns the yaml object with
   */
  async substituteYamlRefs(yaml: any, referencePath: string): Promise<any> {
    const orgYaml = yaml;
    return await this._substituteYamlRefs(yaml, orgYaml, referencePath, 1);
  }

  /**
   * Recursively find '$ref' and substitute the reference with the referenced value
   *
   * @param yaml The recursive object
   * @param orgYaml The original yaml object is used when a reference points to the current yaml file
   * @param referencePath Path to the current
   * @param lvl Level of recursion
   * @returns the current level of the object
   */
  async _substituteYamlRefs(
    yaml: any,
    orgYaml: any,
    referencePath: string,
    lvl: number
  ): Promise<any> {
    if (lvl > 1000) throw Error('Recursive loop gone awry');

    // Loop though all key in object
    for (let key in yaml) {
      let indent = '   '.repeat(lvl);
      // console.log(lvl, indent, key, typeof yaml[key], yaml[key] instanceof Object);

      // Recursively enter any child objects
      if (yaml[key] instanceof Object) {
        yaml[key] = await this._substituteYamlRefs(yaml[key], orgYaml, referencePath, lvl + 1);
      }

      if (key == '$ref') {
        // Substitute the reference with the referenced value
        yaml = await this.fetchRef(yaml[key], orgYaml, referencePath);
      }
    }
    return yaml;
  }

  /**
   * Parse the ref, load and return the referenced object
   */
  async fetchRef(ref: string, orgYaml: any, referencePath: string): Promise<any> {
    let [file, yPath] = this.parseRef(ref);

    let refObj: any = file ? await this.loadRef(file, referencePath) : orgYaml;

    try {
      return yPath ? this.getYPath(refObj, yPath) : refObj;
    } catch (err: any) {
      let filename = file ? file : 'yaml file';
      console.log(`${err.message} in ${filename}`);
      throw Error(`${err.message} in ${filename}`);
    }
  }

  /**
   * Load a reference, and cache it to avoid reloading the same file multiple times.
   */
  async loadRef(filepath: string, referencePath: string): Promise<any> {
    const absUrl = this.makeFullPath(filepath, referencePath);

    if (absUrl && !this._refs[absUrl]) {
      this._refs[absUrl] = await this.loadYamlWithReferencesResolved(absUrl);
    }

    return this._refs[absUrl];
  }

  /**
   * Return the value of the yPath
   *
   * (yPath has similar but simpler syntax to xPath, but refers to yaml files)
   */
  getYPath(obj: any, yPath: string): any {
    if (yPath.startsWith('/')) yPath = yPath.substring(1);
    let path: string[] = yPath.split('/');

    try {
      return this._getYPath(obj, path, 1);
    } catch {
      throw Error(`Cannot find '${yPath}'`);
    }
  }

  _getYPath(obj: any, path: string[], lvl: number = 1): any {
    if (lvl > 1000) throw Error('Too deeply nested object');

    if (path.length == 0) {
      return obj;
    } else if (obj.hasOwnProperty(path[0])) {
      // Recursively go down one level
      const subObj: any = obj[path[0]];
      const subPath: string[] = path.slice(1);
      return this._getYPath(subObj, subPath, lvl + 1);
    } else {
      console.log(`Cound not find the key '${path[0]}'`);
      throw Error(`Cound not find the key '${path[0]}'`);
    }
  }

  /**
   * @returns splits the reference into two: file and yPath
   */
  parseRef(ref: string): string[] {
    let [file, yPath] = ref.split('#');

    file = file ? file.trim() : '';
    yPath = yPath ? yPath.trim() : '';

    return [file, yPath];
  }

  public makeFullPath(relativePath: string, relativeTo: string) {
    let fullPath = new URL(relativePath, 'https://example.org/' + relativeTo).pathname?.slice(1);

    // Make sure the new path does not escape its cage
    let i = relativeTo.lastIndexOf('/');
    if (fullPath.substring(0, i) == relativeTo.substring(0, i)) {
      return fullPath;
    } else {
      console.log(`The ${relativePath} is not allowed outside its root folder`);
      return '';
    }
  }
}
