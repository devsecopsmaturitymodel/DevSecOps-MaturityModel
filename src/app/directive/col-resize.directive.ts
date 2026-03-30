import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({ selector: '[appColResize]' })
export class ColResizeDirective implements OnInit {
  private startX = 0;
  private startWidth = 0;
  private th!: HTMLElement;

  private mouseMoveListener: (() => void) | null = null;
  private mouseUpListener: (() => void) | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.th = this.el.nativeElement;
    this.renderer.setStyle(this.th, 'position', 'relative');

    const handle = this.renderer.createElement('div');
    this.renderer.addClass(handle, 'col-resize-handle');
    this.renderer.appendChild(this.th, handle);

    this.renderer.listen(handle, 'mousedown', (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      this.startX = event.clientX;
      this.startWidth = this.th.offsetWidth;

      this.mouseMoveListener = this.renderer.listen('document', 'mousemove', (e: MouseEvent) => {
        const diff = e.clientX - this.startX;
        const newWidth = Math.max(40, this.startWidth + diff);
        this.applyWidthToAllTables(newWidth);
      });

      this.mouseUpListener = this.renderer.listen('document', 'mouseup', () => {
        if (this.mouseMoveListener) {
          this.mouseMoveListener();
          this.mouseMoveListener = null;
        }
        if (this.mouseUpListener) {
          this.mouseUpListener();
          this.mouseUpListener = null;
        }
      });
    });
  }

  private applyWidthToAllTables(width: number): void {
    const colIndex = this.getColumnIndex(this.th);
    if (colIndex < 0) return;

    const tables = document.querySelectorAll('.resizable-table');
    tables.forEach(table => {
      const ths = table.querySelectorAll('thead th');
      if (colIndex < ths.length) {
        (ths[colIndex] as HTMLElement).style.width = `${width}px`;
      }
    });
  }

  private getColumnIndex(th: HTMLElement): number {
    const row = th.parentElement;
    if (!row) return -1;
    const cells = Array.from(row.children);
    return cells.indexOf(th);
  }
}
