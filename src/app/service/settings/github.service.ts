import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { get } from 'http';

export interface GithubReleaseInfo {
  tagName: string;
  publishedAt?: Date;
  downloadUrl?: string;
  changelogUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  /* eslint-disable */
  private readonly DSOMM_MODEL_URL = 'https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel-data/';
  private readonly CHANGELOG_URL = this.DSOMM_MODEL_URL + '/blob/main/CHANGELOG.md';
  private readonly LATEST_RELEASE_URL = this.DSOMM_MODEL_URL.replace('//github.com', '//api.github.com/repos') + 'releases/latest';
  private readonly DOWNLOAD_URL_TEMPLATE = this.DSOMM_MODEL_URL.replace('//github.com', '//raw.githubusercontent.com') + '{tag}/generated/model.yaml';
  /* eslint-enable */

  constructor(private http: HttpClient) {}

  public getDsommModelUrl(): string {
    return this.DSOMM_MODEL_URL;
  }

  async getLatestRelease(): Promise<GithubReleaseInfo> {
    const obs = this.http.get<GithubReleaseInfo>(this.LATEST_RELEASE_URL);
    const remote: any = await firstValueFrom(obs);
    let releaseInfo: GithubReleaseInfo = {
      tagName: remote?.tag_name || '',
      publishedAt: remote.published_at ? new Date(remote.published_at) : undefined,
      downloadUrl: this.getDownloadUrl(remote?.tag_name),
      changelogUrl: this.getChangelogUrl(),
    };
    return releaseInfo;
  }

  getDownloadUrl(tag: string): string {
    if (!tag) return '';
    // Ensure tag is encoded safely
    const safeTag = encodeURIComponent(tag);
    return this.DOWNLOAD_URL_TEMPLATE.replace('{tag}', safeTag);
  }

  getChangelogUrl(): string {
    return this.CHANGELOG_URL;
  }
}
