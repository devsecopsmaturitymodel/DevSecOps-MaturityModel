import * as md from 'markdown-it';

let markdown: md = md({ html: true });

export class MarkdownText {
  private plain: string | undefined;
  private md: string | undefined;

  constructor(text: MarkdownText | string | undefined) {
    if (text instanceof MarkdownText) {
      this.plain = text.plain;
      this.md = text.md;
    } else {
      this.plain = text;
      this.md = undefined;
    }
  }

  empty(): boolean {
    return this.plain == undefined || this.plain.trim().length == 0;
  }

  hasContent(): boolean {
    return !this.empty();
  }

  toString(): string {
    return this.plain || '';
  }

  render(): string {
    if (!this.plain) return '';
    if (!this.md) this.md = markdown.render(this.plain);
    return this.md;
  }
}
