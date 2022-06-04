/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A pending copy-to-clipboard operation.
 *
 * The implementation of copying text to the clipboard modifies the DOM and
 * forces a relayout. This relayout can take too long if the string is large,
 * causing the execCommand('copy') to happen too long after the user clicked.
 * This results in the browser refusing to copy. This object lets the
 * relayout happen in a separate tick from copying by providing a copy function
 * that can be called later.
 *
 * Destroy must be called when no longer in use, regardless of whether `copy` is
 * called.
 */
export class PendingCopy {
    constructor(text, _document) {
        this._document = _document;
        const textarea = (this._textarea = this._document.createElement('textarea'));
        const styles = textarea.style;
        // Hide the element for display and accessibility. Set a fixed position so the page layout
        // isn't affected. We use `fixed` with `top: 0`, because focus is moved into the textarea
        // for a split second and if it's off-screen, some browsers will attempt to scroll it into view.
        styles.position = 'fixed';
        styles.top = styles.opacity = '0';
        styles.left = '-999em';
        textarea.setAttribute('aria-hidden', 'true');
        textarea.value = text;
        this._document.body.appendChild(textarea);
    }
    /** Finishes copying the text. */
    copy() {
        const textarea = this._textarea;
        let successful = false;
        try {
            // Older browsers could throw if copy is not supported.
            if (textarea) {
                const currentFocus = this._document.activeElement;
                textarea.select();
                textarea.setSelectionRange(0, textarea.value.length);
                successful = this._document.execCommand('copy');
                if (currentFocus) {
                    currentFocus.focus();
                }
            }
        }
        catch {
            // Discard error.
            // Initial setting of {@code successful} will represent failure here.
        }
        return successful;
    }
    /** Cleans up DOM changes used to perform the copy operation. */
    destroy() {
        const textarea = this._textarea;
        if (textarea) {
            textarea.remove();
            this._textarea = undefined;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVuZGluZy1jb3B5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay9jbGlwYm9hcmQvcGVuZGluZy1jb3B5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVIOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBR3RCLFlBQVksSUFBWSxFQUFtQixTQUFtQjtRQUFuQixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQzVELE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzdFLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFFOUIsMEZBQTBGO1FBQzFGLHlGQUF5RjtRQUN6RixnR0FBZ0c7UUFDaEcsTUFBTSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDMUIsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNsQyxNQUFNLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUN2QixRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3QyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELGlDQUFpQztJQUNqQyxJQUFJO1FBQ0YsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNoQyxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFFdkIsSUFBSTtZQUNGLHVEQUF1RDtZQUN2RCxJQUFJLFFBQVEsRUFBRTtnQkFDWixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQXdDLENBQUM7Z0JBRTdFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDbEIsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNyRCxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRWhELElBQUksWUFBWSxFQUFFO29CQUNoQixZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ3RCO2FBQ0Y7U0FDRjtRQUFDLE1BQU07WUFDTixpQkFBaUI7WUFDakIscUVBQXFFO1NBQ3RFO1FBRUQsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELGdFQUFnRTtJQUNoRSxPQUFPO1FBQ0wsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUVoQyxJQUFJLFFBQVEsRUFBRTtZQUNaLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztTQUM1QjtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIEEgcGVuZGluZyBjb3B5LXRvLWNsaXBib2FyZCBvcGVyYXRpb24uXG4gKlxuICogVGhlIGltcGxlbWVudGF0aW9uIG9mIGNvcHlpbmcgdGV4dCB0byB0aGUgY2xpcGJvYXJkIG1vZGlmaWVzIHRoZSBET00gYW5kXG4gKiBmb3JjZXMgYSByZWxheW91dC4gVGhpcyByZWxheW91dCBjYW4gdGFrZSB0b28gbG9uZyBpZiB0aGUgc3RyaW5nIGlzIGxhcmdlLFxuICogY2F1c2luZyB0aGUgZXhlY0NvbW1hbmQoJ2NvcHknKSB0byBoYXBwZW4gdG9vIGxvbmcgYWZ0ZXIgdGhlIHVzZXIgY2xpY2tlZC5cbiAqIFRoaXMgcmVzdWx0cyBpbiB0aGUgYnJvd3NlciByZWZ1c2luZyB0byBjb3B5LiBUaGlzIG9iamVjdCBsZXRzIHRoZVxuICogcmVsYXlvdXQgaGFwcGVuIGluIGEgc2VwYXJhdGUgdGljayBmcm9tIGNvcHlpbmcgYnkgcHJvdmlkaW5nIGEgY29weSBmdW5jdGlvblxuICogdGhhdCBjYW4gYmUgY2FsbGVkIGxhdGVyLlxuICpcbiAqIERlc3Ryb3kgbXVzdCBiZSBjYWxsZWQgd2hlbiBubyBsb25nZXIgaW4gdXNlLCByZWdhcmRsZXNzIG9mIHdoZXRoZXIgYGNvcHlgIGlzXG4gKiBjYWxsZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBQZW5kaW5nQ29weSB7XG4gIHByaXZhdGUgX3RleHRhcmVhOiBIVE1MVGV4dEFyZWFFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBfZG9jdW1lbnQ6IERvY3VtZW50KSB7XG4gICAgY29uc3QgdGV4dGFyZWEgPSAodGhpcy5fdGV4dGFyZWEgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpKTtcbiAgICBjb25zdCBzdHlsZXMgPSB0ZXh0YXJlYS5zdHlsZTtcblxuICAgIC8vIEhpZGUgdGhlIGVsZW1lbnQgZm9yIGRpc3BsYXkgYW5kIGFjY2Vzc2liaWxpdHkuIFNldCBhIGZpeGVkIHBvc2l0aW9uIHNvIHRoZSBwYWdlIGxheW91dFxuICAgIC8vIGlzbid0IGFmZmVjdGVkLiBXZSB1c2UgYGZpeGVkYCB3aXRoIGB0b3A6IDBgLCBiZWNhdXNlIGZvY3VzIGlzIG1vdmVkIGludG8gdGhlIHRleHRhcmVhXG4gICAgLy8gZm9yIGEgc3BsaXQgc2Vjb25kIGFuZCBpZiBpdCdzIG9mZi1zY3JlZW4sIHNvbWUgYnJvd3NlcnMgd2lsbCBhdHRlbXB0IHRvIHNjcm9sbCBpdCBpbnRvIHZpZXcuXG4gICAgc3R5bGVzLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICBzdHlsZXMudG9wID0gc3R5bGVzLm9wYWNpdHkgPSAnMCc7XG4gICAgc3R5bGVzLmxlZnQgPSAnLTk5OWVtJztcbiAgICB0ZXh0YXJlYS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICB0ZXh0YXJlYS52YWx1ZSA9IHRleHQ7XG4gICAgdGhpcy5fZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0YXJlYSk7XG4gIH1cblxuICAvKiogRmluaXNoZXMgY29weWluZyB0aGUgdGV4dC4gKi9cbiAgY29weSgpOiBib29sZWFuIHtcbiAgICBjb25zdCB0ZXh0YXJlYSA9IHRoaXMuX3RleHRhcmVhO1xuICAgIGxldCBzdWNjZXNzZnVsID0gZmFsc2U7XG5cbiAgICB0cnkge1xuICAgICAgLy8gT2xkZXIgYnJvd3NlcnMgY291bGQgdGhyb3cgaWYgY29weSBpcyBub3Qgc3VwcG9ydGVkLlxuICAgICAgaWYgKHRleHRhcmVhKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRGb2N1cyA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgSFRNTE9yU1ZHRWxlbWVudCB8IG51bGw7XG5cbiAgICAgICAgdGV4dGFyZWEuc2VsZWN0KCk7XG4gICAgICAgIHRleHRhcmVhLnNldFNlbGVjdGlvblJhbmdlKDAsIHRleHRhcmVhLnZhbHVlLmxlbmd0aCk7XG4gICAgICAgIHN1Y2Nlc3NmdWwgPSB0aGlzLl9kb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuXG4gICAgICAgIGlmIChjdXJyZW50Rm9jdXMpIHtcbiAgICAgICAgICBjdXJyZW50Rm9jdXMuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gRGlzY2FyZCBlcnJvci5cbiAgICAgIC8vIEluaXRpYWwgc2V0dGluZyBvZiB7QGNvZGUgc3VjY2Vzc2Z1bH0gd2lsbCByZXByZXNlbnQgZmFpbHVyZSBoZXJlLlxuICAgIH1cblxuICAgIHJldHVybiBzdWNjZXNzZnVsO1xuICB9XG5cbiAgLyoqIENsZWFucyB1cCBET00gY2hhbmdlcyB1c2VkIHRvIHBlcmZvcm0gdGhlIGNvcHkgb3BlcmF0aW9uLiAqL1xuICBkZXN0cm95KCkge1xuICAgIGNvbnN0IHRleHRhcmVhID0gdGhpcy5fdGV4dGFyZWE7XG5cbiAgICBpZiAodGV4dGFyZWEpIHtcbiAgICAgIHRleHRhcmVhLnJlbW92ZSgpO1xuICAgICAgdGhpcy5fdGV4dGFyZWEgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG4iXX0=