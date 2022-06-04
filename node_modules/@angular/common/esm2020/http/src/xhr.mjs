/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { XhrFactory } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from './headers';
import { HttpErrorResponse, HttpEventType, HttpHeaderResponse, HttpResponse } from './response';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const XSSI_PREFIX = /^\)\]\}',?\n/;
/**
 * Determine an appropriate URL for the response, by checking either
 * XMLHttpRequest.responseURL or the X-Request-URL header.
 */
function getResponseUrl(xhr) {
    if ('responseURL' in xhr && xhr.responseURL) {
        return xhr.responseURL;
    }
    if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
        return xhr.getResponseHeader('X-Request-URL');
    }
    return null;
}
/**
 * Uses `XMLHttpRequest` to send requests to a backend server.
 * @see `HttpHandler`
 * @see `JsonpClientBackend`
 *
 * @publicApi
 */
export class HttpXhrBackend {
    constructor(xhrFactory) {
        this.xhrFactory = xhrFactory;
    }
    /**
     * Processes a request and returns a stream of response events.
     * @param req The request object.
     * @returns An observable of the response events.
     */
    handle(req) {
        // Quick check to give a better error message when a user attempts to use
        // HttpClient.jsonp() without installing the HttpClientJsonpModule
        if (req.method === 'JSONP') {
            throw new Error(`Attempted to construct Jsonp request without HttpClientJsonpModule installed.`);
        }
        // Everything happens on Observable subscription.
        return new Observable((observer) => {
            // Start by setting up the XHR object with request method, URL, and withCredentials flag.
            const xhr = this.xhrFactory.build();
            xhr.open(req.method, req.urlWithParams);
            if (!!req.withCredentials) {
                xhr.withCredentials = true;
            }
            // Add all the requested headers.
            req.headers.forEach((name, values) => xhr.setRequestHeader(name, values.join(',')));
            // Add an Accept header if one isn't present already.
            if (!req.headers.has('Accept')) {
                xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
            }
            // Auto-detect the Content-Type header if one isn't present already.
            if (!req.headers.has('Content-Type')) {
                const detectedType = req.detectContentTypeHeader();
                // Sometimes Content-Type detection fails.
                if (detectedType !== null) {
                    xhr.setRequestHeader('Content-Type', detectedType);
                }
            }
            // Set the responseType if one was requested.
            if (req.responseType) {
                const responseType = req.responseType.toLowerCase();
                // JSON responses need to be processed as text. This is because if the server
                // returns an XSSI-prefixed JSON response, the browser will fail to parse it,
                // xhr.response will be null, and xhr.responseText cannot be accessed to
                // retrieve the prefixed JSON data in order to strip the prefix. Thus, all JSON
                // is parsed by first requesting text and then applying JSON.parse.
                xhr.responseType = ((responseType !== 'json') ? responseType : 'text');
            }
            // Serialize the request body if one is present. If not, this will be set to null.
            const reqBody = req.serializeBody();
            // If progress events are enabled, response headers will be delivered
            // in two events - the HttpHeaderResponse event and the full HttpResponse
            // event. However, since response headers don't change in between these
            // two events, it doesn't make sense to parse them twice. So headerResponse
            // caches the data extracted from the response whenever it's first parsed,
            // to ensure parsing isn't duplicated.
            let headerResponse = null;
            // partialFromXhr extracts the HttpHeaderResponse from the current XMLHttpRequest
            // state, and memoizes it into headerResponse.
            const partialFromXhr = () => {
                if (headerResponse !== null) {
                    return headerResponse;
                }
                const statusText = xhr.statusText || 'OK';
                // Parse headers from XMLHttpRequest - this step is lazy.
                const headers = new HttpHeaders(xhr.getAllResponseHeaders());
                // Read the response URL from the XMLHttpResponse instance and fall back on the
                // request URL.
                const url = getResponseUrl(xhr) || req.url;
                // Construct the HttpHeaderResponse and memoize it.
                headerResponse = new HttpHeaderResponse({ headers, status: xhr.status, statusText, url });
                return headerResponse;
            };
            // Next, a few closures are defined for the various events which XMLHttpRequest can
            // emit. This allows them to be unregistered as event listeners later.
            // First up is the load event, which represents a response being fully available.
            const onLoad = () => {
                // Read response state from the memoized partial data.
                let { headers, status, statusText, url } = partialFromXhr();
                // The body will be read out if present.
                let body = null;
                if (status !== 204 /* NoContent */) {
                    // Use XMLHttpRequest.response if set, responseText otherwise.
                    body = (typeof xhr.response === 'undefined') ? xhr.responseText : xhr.response;
                }
                // Normalize another potential bug (this one comes from CORS).
                if (status === 0) {
                    status = !!body ? 200 /* Ok */ : 0;
                }
                // ok determines whether the response will be transmitted on the event or
                // error channel. Unsuccessful status codes (not 2xx) will always be errors,
                // but a successful status code can still result in an error if the user
                // asked for JSON data and the body cannot be parsed as such.
                let ok = status >= 200 && status < 300;
                // Check whether the body needs to be parsed as JSON (in many cases the browser
                // will have done that already).
                if (req.responseType === 'json' && typeof body === 'string') {
                    // Save the original body, before attempting XSSI prefix stripping.
                    const originalBody = body;
                    body = body.replace(XSSI_PREFIX, '');
                    try {
                        // Attempt the parse. If it fails, a parse error should be delivered to the user.
                        body = body !== '' ? JSON.parse(body) : null;
                    }
                    catch (error) {
                        // Since the JSON.parse failed, it's reasonable to assume this might not have been a
                        // JSON response. Restore the original body (including any XSSI prefix) to deliver
                        // a better error response.
                        body = originalBody;
                        // If this was an error request to begin with, leave it as a string, it probably
                        // just isn't JSON. Otherwise, deliver the parsing error to the user.
                        if (ok) {
                            // Even though the response status was 2xx, this is still an error.
                            ok = false;
                            // The parse error contains the text of the body that failed to parse.
                            body = { error, text: body };
                        }
                    }
                }
                if (ok) {
                    // A successful response is delivered on the event stream.
                    observer.next(new HttpResponse({
                        body,
                        headers,
                        status,
                        statusText,
                        url: url || undefined,
                    }));
                    // The full body has been received and delivered, no further events
                    // are possible. This request is complete.
                    observer.complete();
                }
                else {
                    // An unsuccessful request is delivered on the error channel.
                    observer.error(new HttpErrorResponse({
                        // The error in this case is the response body (error from the server).
                        error: body,
                        headers,
                        status,
                        statusText,
                        url: url || undefined,
                    }));
                }
            };
            // The onError callback is called when something goes wrong at the network level.
            // Connection timeout, DNS error, offline, etc. These are actual errors, and are
            // transmitted on the error channel.
            const onError = (error) => {
                const { url } = partialFromXhr();
                const res = new HttpErrorResponse({
                    error,
                    status: xhr.status || 0,
                    statusText: xhr.statusText || 'Unknown Error',
                    url: url || undefined,
                });
                observer.error(res);
            };
            // The sentHeaders flag tracks whether the HttpResponseHeaders event
            // has been sent on the stream. This is necessary to track if progress
            // is enabled since the event will be sent on only the first download
            // progerss event.
            let sentHeaders = false;
            // The download progress event handler, which is only registered if
            // progress events are enabled.
            const onDownProgress = (event) => {
                // Send the HttpResponseHeaders event if it hasn't been sent already.
                if (!sentHeaders) {
                    observer.next(partialFromXhr());
                    sentHeaders = true;
                }
                // Start building the download progress event to deliver on the response
                // event stream.
                let progressEvent = {
                    type: HttpEventType.DownloadProgress,
                    loaded: event.loaded,
                };
                // Set the total number of bytes in the event if it's available.
                if (event.lengthComputable) {
                    progressEvent.total = event.total;
                }
                // If the request was for text content and a partial response is
                // available on XMLHttpRequest, include it in the progress event
                // to allow for streaming reads.
                if (req.responseType === 'text' && !!xhr.responseText) {
                    progressEvent.partialText = xhr.responseText;
                }
                // Finally, fire the event.
                observer.next(progressEvent);
            };
            // The upload progress event handler, which is only registered if
            // progress events are enabled.
            const onUpProgress = (event) => {
                // Upload progress events are simpler. Begin building the progress
                // event.
                let progress = {
                    type: HttpEventType.UploadProgress,
                    loaded: event.loaded,
                };
                // If the total number of bytes being uploaded is available, include
                // it.
                if (event.lengthComputable) {
                    progress.total = event.total;
                }
                // Send the event.
                observer.next(progress);
            };
            // By default, register for load and error events.
            xhr.addEventListener('load', onLoad);
            xhr.addEventListener('error', onError);
            xhr.addEventListener('timeout', onError);
            xhr.addEventListener('abort', onError);
            // Progress events are only enabled if requested.
            if (req.reportProgress) {
                // Download progress is always enabled if requested.
                xhr.addEventListener('progress', onDownProgress);
                // Upload progress depends on whether there is a body to upload.
                if (reqBody !== null && xhr.upload) {
                    xhr.upload.addEventListener('progress', onUpProgress);
                }
            }
            // Fire the request, and notify the event stream that it was fired.
            xhr.send(reqBody);
            observer.next({ type: HttpEventType.Sent });
            // This is the return from the Observable function, which is the
            // request cancellation handler.
            return () => {
                // On a cancellation, remove all registered event listeners.
                xhr.removeEventListener('error', onError);
                xhr.removeEventListener('abort', onError);
                xhr.removeEventListener('load', onLoad);
                xhr.removeEventListener('timeout', onError);
                if (req.reportProgress) {
                    xhr.removeEventListener('progress', onDownProgress);
                    if (reqBody !== null && xhr.upload) {
                        xhr.upload.removeEventListener('progress', onUpProgress);
                    }
                }
                // Finally, abort the in-flight request.
                if (xhr.readyState !== xhr.DONE) {
                    xhr.abort();
                }
            };
        });
    }
}
HttpXhrBackend.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: HttpXhrBackend, deps: [{ token: i1.XhrFactory }], target: i0.ɵɵFactoryTarget.Injectable });
HttpXhrBackend.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: HttpXhrBackend });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10", ngImport: i0, type: HttpXhrBackend, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.XhrFactory }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvc3JjL3hoci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsVUFBVSxFQUFXLE1BQU0sTUFBTSxDQUFDO0FBRzFDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFdEMsT0FBTyxFQUE0QixpQkFBaUIsRUFBYSxhQUFhLEVBQUUsa0JBQWtCLEVBQXNCLFlBQVksRUFBMEMsTUFBTSxZQUFZLENBQUM7OztBQUdqTSxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUM7QUFFbkM7OztHQUdHO0FBQ0gsU0FBUyxjQUFjLENBQUMsR0FBUTtJQUM5QixJQUFJLGFBQWEsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRTtRQUMzQyxPQUFPLEdBQUcsQ0FBQyxXQUFXLENBQUM7S0FDeEI7SUFDRCxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxFQUFFO1FBQ3hELE9BQU8sR0FBRyxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQy9DO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBRUgsTUFBTSxPQUFPLGNBQWM7SUFDekIsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtJQUFHLENBQUM7SUFFOUM7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxHQUFxQjtRQUMxQix5RUFBeUU7UUFDekUsa0VBQWtFO1FBQ2xFLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxPQUFPLEVBQUU7WUFDMUIsTUFB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bGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1hockZhY3Rvcnl9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBPYnNlcnZlcn0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7SHR0cEJhY2tlbmR9IGZyb20gJy4vYmFja2VuZCc7XG5pbXBvcnQge0h0dHBIZWFkZXJzfSBmcm9tICcuL2hlYWRlcnMnO1xuaW1wb3J0IHtIdHRwUmVxdWVzdH0gZnJvbSAnLi9yZXF1ZXN0JztcbmltcG9ydCB7SHR0cERvd25sb2FkUHJvZ3Jlc3NFdmVudCwgSHR0cEVycm9yUmVzcG9uc2UsIEh0dHBFdmVudCwgSHR0cEV2ZW50VHlwZSwgSHR0cEhlYWRlclJlc3BvbnNlLCBIdHRwSnNvblBhcnNlRXJyb3IsIEh0dHBSZXNwb25zZSwgSHR0cFN0YXR1c0NvZGUsIEh0dHBVcGxvYWRQcm9ncmVzc0V2ZW50fSBmcm9tICcuL3Jlc3BvbnNlJztcblxuXG5jb25zdCBYU1NJX1BSRUZJWCA9IC9eXFwpXFxdXFx9Jyw/XFxuLztcblxuLyoqXG4gKiBEZXRlcm1pbmUgYW4gYXBwcm9wcmlhdGUgVVJMIGZvciB0aGUgcmVzcG9uc2UsIGJ5IGNoZWNraW5nIGVpdGhlclxuICogWE1MSHR0cFJlcXVlc3QucmVzcG9uc2VVUkwgb3IgdGhlIFgtUmVxdWVzdC1VUkwgaGVhZGVyLlxuICovXG5mdW5jdGlvbiBnZXRSZXNwb25zZVVybCh4aHI6IGFueSk6IHN0cmluZ3xudWxsIHtcbiAgaWYgKCdyZXNwb25zZVVSTCcgaW4geGhyICYmIHhoci5yZXNwb25zZVVSTCkge1xuICAgIHJldHVybiB4aHIucmVzcG9uc2VVUkw7XG4gIH1cbiAgaWYgKC9eWC1SZXF1ZXN0LVVSTDovbS50ZXN0KHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkpIHtcbiAgICByZXR1cm4geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdYLVJlcXVlc3QtVVJMJyk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogVXNlcyBgWE1MSHR0cFJlcXVlc3RgIHRvIHNlbmQgcmVxdWVzdHMgdG8gYSBiYWNrZW5kIHNlcnZlci5cbiAqIEBzZWUgYEh0dHBIYW5kbGVyYFxuICogQHNlZSBgSnNvbnBDbGllbnRCYWNrZW5kYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEh0dHBYaHJCYWNrZW5kIGltcGxlbWVudHMgSHR0cEJhY2tlbmQge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHhockZhY3Rvcnk6IFhockZhY3RvcnkpIHt9XG5cbiAgLyoqXG4gICAqIFByb2Nlc3NlcyBhIHJlcXVlc3QgYW5kIHJldHVybnMgYSBzdHJlYW0gb2YgcmVzcG9uc2UgZXZlbnRzLlxuICAgKiBAcGFyYW0gcmVxIFRoZSByZXF1ZXN0IG9iamVjdC5cbiAgICogQHJldHVybnMgQW4gb2JzZXJ2YWJsZSBvZiB0aGUgcmVzcG9uc2UgZXZlbnRzLlxuICAgKi9cbiAgaGFuZGxlKHJlcTogSHR0cFJlcXVlc3Q8YW55Pik6IE9ic2VydmFibGU8SHR0cEV2ZW50PGFueT4+IHtcbiAgICAvLyBRdWljayBjaGVjayB0byBnaXZlIGEgYmV0dGVyIGVycm9yIG1lc3NhZ2Ugd2hlbiBhIHVzZXIgYXR0ZW1wdHMgdG8gdXNlXG4gICAgLy8gSHR0cENsaWVudC5qc29ucCgpIHdpdGhvdXQgaW5zdGFsbGluZyB0aGUgSHR0cENsaWVudEpzb25wTW9kdWxlXG4gICAgaWYgKHJlcS5tZXRob2QgPT09ICdKU09OUCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgQXR0ZW1wdGVkIHRvIGNvbnN0cnVjdCBKc29ucCByZXF1ZXN0IHdpdGhvdXQgSHR0cENsaWVudEpzb25wTW9kdWxlIGluc3RhbGxlZC5gKTtcbiAgICB9XG5cbiAgICAvLyBFdmVyeXRoaW5nIGhhcHBlbnMgb24gT2JzZXJ2YWJsZSBzdWJzY3JpcHRpb24uXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcjogT2JzZXJ2ZXI8SHR0cEV2ZW50PGFueT4+KSA9PiB7XG4gICAgICAvLyBTdGFydCBieSBzZXR0aW5nIHVwIHRoZSBYSFIgb2JqZWN0IHdpdGggcmVxdWVzdCBtZXRob2QsIFVSTCwgYW5kIHdpdGhDcmVkZW50aWFscyBmbGFnLlxuICAgICAgY29uc3QgeGhyID0gdGhpcy54aHJGYWN0b3J5LmJ1aWxkKCk7XG4gICAgICB4aHIub3BlbihyZXEubWV0aG9kLCByZXEudXJsV2l0aFBhcmFtcyk7XG4gICAgICBpZiAoISFyZXEud2l0aENyZWRlbnRpYWxzKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgYWxsIHRoZSByZXF1ZXN0ZWQgaGVhZGVycy5cbiAgICAgIHJlcS5oZWFkZXJzLmZvckVhY2goKG5hbWUsIHZhbHVlcykgPT4geGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWVzLmpvaW4oJywnKSkpO1xuXG4gICAgICAvLyBBZGQgYW4gQWNjZXB0IGhlYWRlciBpZiBvbmUgaXNuJ3QgcHJlc2VudCBhbHJlYWR5LlxuICAgICAgaWYgKCFyZXEuaGVhZGVycy5oYXMoJ0FjY2VwdCcpKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEF1dG8tZGV0ZWN0IHRoZSBDb250ZW50LVR5cGUgaGVhZGVyIGlmIG9uZSBpc24ndCBwcmVzZW50IGFscmVhZHkuXG4gICAgICBpZiAoIXJlcS5oZWFkZXJzLmhhcygnQ29udGVudC1UeXBlJykpIHtcbiAgICAgICAgY29uc3QgZGV0ZWN0ZWRUeXBlID0gcmVxLmRldGVjdENvbnRlbnRUeXBlSGVhZGVyKCk7XG4gICAgICAgIC8vIFNvbWV0aW1lcyBDb250ZW50LVR5cGUgZGV0ZWN0aW9uIGZhaWxzLlxuICAgICAgICBpZiAoZGV0ZWN0ZWRUeXBlICE9PSBudWxsKSB7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsIGRldGVjdGVkVHlwZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU2V0IHRoZSByZXNwb25zZVR5cGUgaWYgb25lIHdhcyByZXF1ZXN0ZWQuXG4gICAgICBpZiAocmVxLnJlc3BvbnNlVHlwZSkge1xuICAgICAgICBjb25zdCByZXNwb25zZVR5cGUgPSByZXEucmVzcG9uc2VUeXBlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgLy8gSlNPTiByZXNwb25zZXMgbmVlZCB0byBiZSBwcm9jZXNzZWQgYXMgdGV4dC4gVGhpcyBpcyBiZWNhdXNlIGlmIHRoZSBzZXJ2ZXJcbiAgICAgICAgLy8gcmV0dXJucyBhbiBYU1NJLXByZWZpeGVkIEpTT04gcmVzcG9uc2UsIHRoZSBicm93c2VyIHdpbGwgZmFpbCB0byBwYXJzZSBpdCxcbiAgICAgICAgLy8geGhyLnJlc3BvbnNlIHdpbGwgYmUgbnVsbCwgYW5kIHhoci5yZXNwb25zZVRleHQgY2Fubm90IGJlIGFjY2Vzc2VkIHRvXG4gICAgICAgIC8vIHJldHJpZXZlIHRoZSBwcmVmaXhlZCBKU09OIGRhdGEgaW4gb3JkZXIgdG8gc3RyaXAgdGhlIHByZWZpeC4gVGh1cywgYWxsIEpTT05cbiAgICAgICAgLy8gaXMgcGFyc2VkIGJ5IGZpcnN0IHJlcXVlc3RpbmcgdGV4dCBhbmQgdGhlbiBhcHBseWluZyBKU09OLnBhcnNlLlxuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gKChyZXNwb25zZVR5cGUgIT09ICdqc29uJykgPyByZXNwb25zZVR5cGUgOiAndGV4dCcpIGFzIGFueTtcbiAgICAgIH1cblxuICAgICAgLy8gU2VyaWFsaXplIHRoZSByZXF1ZXN0IGJvZHkgaWYgb25lIGlzIHByZXNlbnQuIElmIG5vdCwgdGhpcyB3aWxsIGJlIHNldCB0byBudWxsLlxuICAgICAgY29uc3QgcmVxQm9keSA9IHJlcS5zZXJpYWxpemVCb2R5KCk7XG5cbiAgICAgIC8vIElmIHByb2dyZXNzIGV2ZW50cyBhcmUgZW5hYmxlZCwgcmVzcG9uc2UgaGVhZGVycyB3aWxsIGJlIGRlbGl2ZXJlZFxuICAgICAgLy8gaW4gdHdvIGV2ZW50cyAtIHRoZSBIdHRwSGVhZGVyUmVzcG9uc2UgZXZlbnQgYW5kIHRoZSBmdWxsIEh0dHBSZXNwb25zZVxuICAgICAgLy8gZXZlbnQuIEhvd2V2ZXIsIHNpbmNlIHJlc3BvbnNlIGhlYWRlcnMgZG9uJ3QgY2hhbmdlIGluIGJldHdlZW4gdGhlc2VcbiAgICAgIC8vIHR3byBldmVudHMsIGl0IGRvZXNuJ3QgbWFrZSBzZW5zZSB0byBwYXJzZSB0aGVtIHR3aWNlLiBTbyBoZWFkZXJSZXNwb25zZVxuICAgICAgLy8gY2FjaGVzIHRoZSBkYXRhIGV4dHJhY3RlZCBmcm9tIHRoZSByZXNwb25zZSB3aGVuZXZlciBpdCdzIGZpcnN0IHBhcnNlZCxcbiAgICAgIC8vIHRvIGVuc3VyZSBwYXJzaW5nIGlzbid0IGR1cGxpY2F0ZWQuXG4gICAgICBsZXQgaGVhZGVyUmVzcG9uc2U6IEh0dHBIZWFkZXJSZXNwb25zZXxudWxsID0gbnVsbDtcblxuICAgICAgLy8gcGFydGlhbEZyb21YaHIgZXh0cmFjdHMgdGhlIEh0dHBIZWFkZXJSZXNwb25zZSBmcm9tIHRoZSBjdXJyZW50IFhNTEh0dHBSZXF1ZXN0XG4gICAgICAvLyBzdGF0ZSwgYW5kIG1lbW9pemVzIGl0IGludG8gaGVhZGVyUmVzcG9uc2UuXG4gICAgICBjb25zdCBwYXJ0aWFsRnJvbVhociA9ICgpOiBIdHRwSGVhZGVyUmVzcG9uc2UgPT4ge1xuICAgICAgICBpZiAoaGVhZGVyUmVzcG9uc2UgIT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gaGVhZGVyUmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGF0dXNUZXh0ID0geGhyLnN0YXR1c1RleHQgfHwgJ09LJztcblxuICAgICAgICAvLyBQYXJzZSBoZWFkZXJzIGZyb20gWE1MSHR0cFJlcXVlc3QgLSB0aGlzIHN0ZXAgaXMgbGF6eS5cbiAgICAgICAgY29uc3QgaGVhZGVycyA9IG5ldyBIdHRwSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuXG4gICAgICAgIC8vIFJlYWQgdGhlIHJlc3BvbnNlIFVSTCBmcm9tIHRoZSBYTUxIdHRwUmVzcG9uc2UgaW5zdGFuY2UgYW5kIGZhbGwgYmFjayBvbiB0aGVcbiAgICAgICAgLy8gcmVxdWVzdCBVUkwuXG4gICAgICAgIGNvbnN0IHVybCA9IGdldFJlc3BvbnNlVXJsKHhocikgfHwgcmVxLnVybDtcblxuICAgICAgICAvLyBDb25zdHJ1Y3QgdGhlIEh0dHBIZWFkZXJSZXNwb25zZSBhbmQgbWVtb2l6ZSBpdC5cbiAgICAgICAgaGVhZGVyUmVzcG9uc2UgPSBuZXcgSHR0cEhlYWRlclJlc3BvbnNlKHtoZWFkZXJzLCBzdGF0dXM6IHhoci5zdGF0dXMsIHN0YXR1c1RleHQsIHVybH0pO1xuICAgICAgICByZXR1cm4gaGVhZGVyUmVzcG9uc2U7XG4gICAgICB9O1xuXG4gICAgICAvLyBOZXh0LCBhIGZldyBjbG9zdXJlcyBhcmUgZGVmaW5lZCBmb3IgdGhlIHZhcmlvdXMgZXZlbnRzIHdoaWNoIFhNTEh0dHBSZXF1ZXN0IGNhblxuICAgICAgLy8gZW1pdC4gVGhpcyBhbGxvd3MgdGhlbSB0byBiZSB1bnJlZ2lzdGVyZWQgYXMgZXZlbnQgbGlzdGVuZXJzIGxhdGVyLlxuXG4gICAgICAvLyBGaXJzdCB1cCBpcyB0aGUgbG9hZCBldmVudCwgd2hpY2ggcmVwcmVzZW50cyBhIHJlc3BvbnNlIGJlaW5nIGZ1bGx5IGF2YWlsYWJsZS5cbiAgICAgIGNvbnN0IG9uTG9hZCA9ICgpID0+IHtcbiAgICAgICAgLy8gUmVhZCByZXNwb25zZSBzdGF0ZSBmcm9tIHRoZSBtZW1vaXplZCBwYXJ0aWFsIGRhdGEuXG4gICAgICAgIGxldCB7aGVhZGVycywgc3RhdHVzLCBzdGF0dXNUZXh0LCB1cmx9ID0gcGFydGlhbEZyb21YaHIoKTtcblxuICAgICAgICAvLyBUaGUgYm9keSB3aWxsIGJlIHJlYWQgb3V0IGlmIHByZXNlbnQuXG4gICAgICAgIGxldCBib2R5OiBhbnl8bnVsbCA9IG51bGw7XG5cbiAgICAgICAgaWYgKHN0YXR1cyAhPT0gSHR0cFN0YXR1c0NvZGUuTm9Db250ZW50KSB7XG4gICAgICAgICAgLy8gVXNlIFhNTEh0dHBSZXF1ZXN0LnJlc3BvbnNlIGlmIHNldCwgcmVzcG9uc2VUZXh0IG90aGVyd2lzZS5cbiAgICAgICAgICBib2R5ID0gKHR5cGVvZiB4aHIucmVzcG9uc2UgPT09ICd1bmRlZmluZWQnKSA/IHhoci5yZXNwb25zZVRleHQgOiB4aHIucmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3JtYWxpemUgYW5vdGhlciBwb3RlbnRpYWwgYnVnICh0aGlzIG9uZSBjb21lcyBmcm9tIENPUlMpLlxuICAgICAgICBpZiAoc3RhdHVzID09PSAwKSB7XG4gICAgICAgICAgc3RhdHVzID0gISFib2R5ID8gSHR0cFN0YXR1c0NvZGUuT2sgOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb2sgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSByZXNwb25zZSB3aWxsIGJlIHRyYW5zbWl0dGVkIG9uIHRoZSBldmVudCBvclxuICAgICAgICAvLyBlcnJvciBjaGFubmVsLiBVbnN1Y2Nlc3NmdWwgc3RhdHVzIGNvZGVzIChub3QgMnh4KSB3aWxsIGFsd2F5cyBiZSBlcnJvcnMsXG4gICAgICAgIC8vIGJ1dCBhIHN1Y2Nlc3NmdWwgc3RhdHVzIGNvZGUgY2FuIHN0aWxsIHJlc3VsdCBpbiBhbiBlcnJvciBpZiB0aGUgdXNlclxuICAgICAgICAvLyBhc2tlZCBmb3IgSlNPTiBkYXRhIGFuZCB0aGUgYm9keSBjYW5ub3QgYmUgcGFyc2VkIGFzIHN1Y2guXG4gICAgICAgIGxldCBvayA9IHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwO1xuXG4gICAgICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGJvZHkgbmVlZHMgdG8gYmUgcGFyc2VkIGFzIEpTT04gKGluIG1hbnkgY2FzZXMgdGhlIGJyb3dzZXJcbiAgICAgICAgLy8gd2lsbCBoYXZlIGRvbmUgdGhhdCBhbHJlYWR5KS5cbiAgICAgICAgaWYgKHJlcS5yZXNwb25zZVR5cGUgPT09ICdqc29uJyAmJiB0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAvLyBTYXZlIHRoZSBvcmlnaW5hbCBib2R5LCBiZWZvcmUgYXR0ZW1wdGluZyBYU1NJIHByZWZpeCBzdHJpcHBpbmcuXG4gICAgICAgICAgY29uc3Qgb3JpZ2luYWxCb2R5ID0gYm9keTtcbiAgICAgICAgICBib2R5ID0gYm9keS5yZXBsYWNlKFhTU0lfUFJFRklYLCAnJyk7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIEF0dGVtcHQgdGhlIHBhcnNlLiBJZiBpdCBmYWlscywgYSBwYXJzZSBlcnJvciBzaG91bGQgYmUgZGVsaXZlcmVkIHRvIHRoZSB1c2VyLlxuICAgICAgICAgICAgYm9keSA9IGJvZHkgIT09ICcnID8gSlNPTi5wYXJzZShib2R5KSA6IG51bGw7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBKU09OLnBhcnNlIGZhaWxlZCwgaXQncyByZWFzb25hYmxlIHRvIGFzc3VtZSB0aGlzIG1pZ2h0IG5vdCBoYXZlIGJlZW4gYVxuICAgICAgICAgICAgLy8gSlNPTiByZXNwb25zZS4gUmVzdG9yZSB0aGUgb3JpZ2luYWwgYm9keSAoaW5jbHVkaW5nIGFueSBYU1NJIHByZWZpeCkgdG8gZGVsaXZlclxuICAgICAgICAgICAgLy8gYSBiZXR0ZXIgZXJyb3IgcmVzcG9uc2UuXG4gICAgICAgICAgICBib2R5ID0gb3JpZ2luYWxCb2R5O1xuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIHdhcyBhbiBlcnJvciByZXF1ZXN0IHRvIGJlZ2luIHdpdGgsIGxlYXZlIGl0IGFzIGEgc3RyaW5nLCBpdCBwcm9iYWJseVxuICAgICAgICAgICAgLy8ganVzdCBpc24ndCBKU09OLiBPdGhlcndpc2UsIGRlbGl2ZXIgdGhlIHBhcnNpbmcgZXJyb3IgdG8gdGhlIHVzZXIuXG4gICAgICAgICAgICBpZiAob2spIHtcbiAgICAgICAgICAgICAgLy8gRXZlbiB0aG91Z2ggdGhlIHJlc3BvbnNlIHN0YXR1cyB3YXMgMnh4LCB0aGlzIGlzIHN0aWxsIGFuIGVycm9yLlxuICAgICAgICAgICAgICBvayA9IGZhbHNlO1xuICAgICAgICAgICAgICAvLyBUaGUgcGFyc2UgZXJyb3IgY29udGFpbnMgdGhlIHRleHQgb2YgdGhlIGJvZHkgdGhhdCBmYWlsZWQgdG8gcGFyc2UuXG4gICAgICAgICAgICAgIGJvZHkgPSB7ZXJyb3IsIHRleHQ6IGJvZHl9IGFzIEh0dHBKc29uUGFyc2VFcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2spIHtcbiAgICAgICAgICAvLyBBIHN1Y2Nlc3NmdWwgcmVzcG9uc2UgaXMgZGVsaXZlcmVkIG9uIHRoZSBldmVudCBzdHJlYW0uXG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dChuZXcgSHR0cFJlc3BvbnNlKHtcbiAgICAgICAgICAgIGJvZHksXG4gICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgc3RhdHVzLFxuICAgICAgICAgICAgc3RhdHVzVGV4dCxcbiAgICAgICAgICAgIHVybDogdXJsIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgLy8gVGhlIGZ1bGwgYm9keSBoYXMgYmVlbiByZWNlaXZlZCBhbmQgZGVsaXZlcmVkLCBubyBmdXJ0aGVyIGV2ZW50c1xuICAgICAgICAgIC8vIGFyZSBwb3NzaWJsZS4gVGhpcyByZXF1ZXN0IGlzIGNvbXBsZXRlLlxuICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQW4gdW5zdWNjZXNzZnVsIHJlcXVlc3QgaXMgZGVsaXZlcmVkIG9uIHRoZSBlcnJvciBjaGFubmVsLlxuICAgICAgICAgIG9ic2VydmVyLmVycm9yKG5ldyBIdHRwRXJyb3JSZXNwb25zZSh7XG4gICAgICAgICAgICAvLyBUaGUgZXJyb3IgaW4gdGhpcyBjYXNlIGlzIHRoZSByZXNwb25zZSBib2R5IChlcnJvciBmcm9tIHRoZSBzZXJ2ZXIpLlxuICAgICAgICAgICAgZXJyb3I6IGJvZHksXG4gICAgICAgICAgICBoZWFkZXJzLFxuICAgICAgICAgICAgc3RhdHVzLFxuICAgICAgICAgICAgc3RhdHVzVGV4dCxcbiAgICAgICAgICAgIHVybDogdXJsIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIFRoZSBvbkVycm9yIGNhbGxiYWNrIGlzIGNhbGxlZCB3aGVuIHNvbWV0aGluZyBnb2VzIHdyb25nIGF0IHRoZSBuZXR3b3JrIGxldmVsLlxuICAgICAgLy8gQ29ubmVjdGlvbiB0aW1lb3V0LCBETlMgZXJyb3IsIG9mZmxpbmUsIGV0Yy4gVGhlc2UgYXJlIGFjdHVhbCBlcnJvcnMsIGFuZCBhcmVcbiAgICAgIC8vIHRyYW5zbWl0dGVkIG9uIHRoZSBlcnJvciBjaGFubmVsLlxuICAgICAgY29uc3Qgb25FcnJvciA9IChlcnJvcjogUHJvZ3Jlc3NFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCB7dXJsfSA9IHBhcnRpYWxGcm9tWGhyKCk7XG4gICAgICAgIGNvbnN0IHJlcyA9IG5ldyBIdHRwRXJyb3JSZXNwb25zZSh7XG4gICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzIHx8IDAsXG4gICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQgfHwgJ1Vua25vd24gRXJyb3InLFxuICAgICAgICAgIHVybDogdXJsIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgfSk7XG4gICAgICAgIG9ic2VydmVyLmVycm9yKHJlcyk7XG4gICAgICB9O1xuXG4gICAgICAvLyBUaGUgc2VudEhlYWRlcnMgZmxhZyB0cmFja3Mgd2hldGhlciB0aGUgSHR0cFJlc3BvbnNlSGVhZGVycyBldmVudFxuICAgICAgLy8gaGFzIGJlZW4gc2VudCBvbiB0aGUgc3RyZWFtLiBUaGlzIGlzIG5lY2Vzc2FyeSB0byB0cmFjayBpZiBwcm9ncmVzc1xuICAgICAgLy8gaXMgZW5hYmxlZCBzaW5jZSB0aGUgZXZlbnQgd2lsbCBiZSBzZW50IG9uIG9ubHkgdGhlIGZpcnN0IGRvd25sb2FkXG4gICAgICAvLyBwcm9nZXJzcyBldmVudC5cbiAgICAgIGxldCBzZW50SGVhZGVycyA9IGZhbHNlO1xuXG4gICAgICAvLyBUaGUgZG93bmxvYWQgcHJvZ3Jlc3MgZXZlbnQgaGFuZGxlciwgd2hpY2ggaXMgb25seSByZWdpc3RlcmVkIGlmXG4gICAgICAvLyBwcm9ncmVzcyBldmVudHMgYXJlIGVuYWJsZWQuXG4gICAgICBjb25zdCBvbkRvd25Qcm9ncmVzcyA9IChldmVudDogUHJvZ3Jlc3NFdmVudCkgPT4ge1xuICAgICAgICAvLyBTZW5kIHRoZSBIdHRwUmVzcG9uc2VIZWFkZXJzIGV2ZW50IGlmIGl0IGhhc24ndCBiZWVuIHNlbnQgYWxyZWFkeS5cbiAgICAgICAgaWYgKCFzZW50SGVhZGVycykge1xuICAgICAgICAgIG9ic2VydmVyLm5leHQocGFydGlhbEZyb21YaHIoKSk7XG4gICAgICAgICAgc2VudEhlYWRlcnMgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RhcnQgYnVpbGRpbmcgdGhlIGRvd25sb2FkIHByb2dyZXNzIGV2ZW50IHRvIGRlbGl2ZXIgb24gdGhlIHJlc3BvbnNlXG4gICAgICAgIC8vIGV2ZW50IHN0cmVhbS5cbiAgICAgICAgbGV0IHByb2dyZXNzRXZlbnQ6IEh0dHBEb3dubG9hZFByb2dyZXNzRXZlbnQgPSB7XG4gICAgICAgICAgdHlwZTogSHR0cEV2ZW50VHlwZS5Eb3dubG9hZFByb2dyZXNzLFxuICAgICAgICAgIGxvYWRlZDogZXZlbnQubG9hZGVkLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFNldCB0aGUgdG90YWwgbnVtYmVyIG9mIGJ5dGVzIGluIHRoZSBldmVudCBpZiBpdCdzIGF2YWlsYWJsZS5cbiAgICAgICAgaWYgKGV2ZW50Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICBwcm9ncmVzc0V2ZW50LnRvdGFsID0gZXZlbnQudG90YWw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgcmVxdWVzdCB3YXMgZm9yIHRleHQgY29udGVudCBhbmQgYSBwYXJ0aWFsIHJlc3BvbnNlIGlzXG4gICAgICAgIC8vIGF2YWlsYWJsZSBvbiBYTUxIdHRwUmVxdWVzdCwgaW5jbHVkZSBpdCBpbiB0aGUgcHJvZ3Jlc3MgZXZlbnRcbiAgICAgICAgLy8gdG8gYWxsb3cgZm9yIHN0cmVhbWluZyByZWFkcy5cbiAgICAgICAgaWYgKHJlcS5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JyAmJiAhIXhoci5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgICBwcm9ncmVzc0V2ZW50LnBhcnRpYWxUZXh0ID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmFsbHksIGZpcmUgdGhlIGV2ZW50LlxuICAgICAgICBvYnNlcnZlci5uZXh0KHByb2dyZXNzRXZlbnQpO1xuICAgICAgfTtcblxuICAgICAgLy8gVGhlIHVwbG9hZCBwcm9ncmVzcyBldmVudCBoYW5kbGVyLCB3aGljaCBpcyBvbmx5IHJlZ2lzdGVyZWQgaWZcbiAgICAgIC8vIHByb2dyZXNzIGV2ZW50cyBhcmUgZW5hYmxlZC5cbiAgICAgIGNvbnN0IG9uVXBQcm9ncmVzcyA9IChldmVudDogUHJvZ3Jlc3NFdmVudCkgPT4ge1xuICAgICAgICAvLyBVcGxvYWQgcHJvZ3Jlc3MgZXZlbnRzIGFyZSBzaW1wbGVyLiBCZWdpbiBidWlsZGluZyB0aGUgcHJvZ3Jlc3NcbiAgICAgICAgLy8gZXZlbnQuXG4gICAgICAgIGxldCBwcm9ncmVzczogSHR0cFVwbG9hZFByb2dyZXNzRXZlbnQgPSB7XG4gICAgICAgICAgdHlwZTogSHR0cEV2ZW50VHlwZS5VcGxvYWRQcm9ncmVzcyxcbiAgICAgICAgICBsb2FkZWQ6IGV2ZW50LmxvYWRlZCxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJZiB0aGUgdG90YWwgbnVtYmVyIG9mIGJ5dGVzIGJlaW5nIHVwbG9hZGVkIGlzIGF2YWlsYWJsZSwgaW5jbHVkZVxuICAgICAgICAvLyBpdC5cbiAgICAgICAgaWYgKGV2ZW50Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICBwcm9ncmVzcy50b3RhbCA9IGV2ZW50LnRvdGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VuZCB0aGUgZXZlbnQuXG4gICAgICAgIG9ic2VydmVyLm5leHQocHJvZ3Jlc3MpO1xuICAgICAgfTtcblxuICAgICAgLy8gQnkgZGVmYXVsdCwgcmVnaXN0ZXIgZm9yIGxvYWQgYW5kIGVycm9yIGV2ZW50cy5cbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25Mb2FkKTtcbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWVvdXQnLCBvbkVycm9yKTtcbiAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uRXJyb3IpO1xuXG4gICAgICAvLyBQcm9ncmVzcyBldmVudHMgYXJlIG9ubHkgZW5hYmxlZCBpZiByZXF1ZXN0ZWQuXG4gICAgICBpZiAocmVxLnJlcG9ydFByb2dyZXNzKSB7XG4gICAgICAgIC8vIERvd25sb2FkIHByb2dyZXNzIGlzIGFsd2F5cyBlbmFibGVkIGlmIHJlcXVlc3RlZC5cbiAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgb25Eb3duUHJvZ3Jlc3MpO1xuXG4gICAgICAgIC8vIFVwbG9hZCBwcm9ncmVzcyBkZXBlbmRzIG9uIHdoZXRoZXIgdGhlcmUgaXMgYSBib2R5IHRvIHVwbG9hZC5cbiAgICAgICAgaWYgKHJlcUJvZHkgIT09IG51bGwgJiYgeGhyLnVwbG9hZCkge1xuICAgICAgICAgIHhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBvblVwUHJvZ3Jlc3MpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEZpcmUgdGhlIHJlcXVlc3QsIGFuZCBub3RpZnkgdGhlIGV2ZW50IHN0cmVhbSB0aGF0IGl0IHdhcyBmaXJlZC5cbiAgICAgIHhoci5zZW5kKHJlcUJvZHkhKTtcbiAgICAgIG9ic2VydmVyLm5leHQoe3R5cGU6IEh0dHBFdmVudFR5cGUuU2VudH0pO1xuXG4gICAgICAvLyBUaGlzIGlzIHRoZSByZXR1cm4gZnJvbSB0aGUgT2JzZXJ2YWJsZSBmdW5jdGlvbiwgd2hpY2ggaXMgdGhlXG4gICAgICAvLyByZXF1ZXN0IGNhbmNlbGxhdGlvbiBoYW5kbGVyLlxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgLy8gT24gYSBjYW5jZWxsYXRpb24sIHJlbW92ZSBhbGwgcmVnaXN0ZXJlZCBldmVudCBsaXN0ZW5lcnMuXG4gICAgICAgIHhoci5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgICB4aHIucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkVycm9yKTtcbiAgICAgICAgeGhyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBvbkxvYWQpO1xuICAgICAgICB4aHIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndGltZW91dCcsIG9uRXJyb3IpO1xuICAgICAgICBpZiAocmVxLnJlcG9ydFByb2dyZXNzKSB7XG4gICAgICAgICAgeGhyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgb25Eb3duUHJvZ3Jlc3MpO1xuICAgICAgICAgIGlmIChyZXFCb2R5ICE9PSBudWxsICYmIHhoci51cGxvYWQpIHtcbiAgICAgICAgICAgIHhoci51cGxvYWQucmVtb3ZlRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBvblVwUHJvZ3Jlc3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmFsbHksIGFib3J0IHRoZSBpbi1mbGlnaHQgcmVxdWVzdC5cbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlICE9PSB4aHIuRE9ORSkge1xuICAgICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG59XG4iXX0=