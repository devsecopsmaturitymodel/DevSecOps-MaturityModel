/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { addAriaReferencedId, getAriaReferenceIds, removeAriaReferencedId } from './aria-reference';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/**
 * ID used for the body container where all messages are appended.
 * @deprecated No longer being used. To be removed.
 * @breaking-change 14.0.0
 */
export const MESSAGES_CONTAINER_ID = 'cdk-describedby-message-container';
/**
 * ID prefix used for each created message element.
 * @deprecated To be turned into a private variable.
 * @breaking-change 14.0.0
 */
export const CDK_DESCRIBEDBY_ID_PREFIX = 'cdk-describedby-message';
/**
 * Attribute given to each host element that is described by a message element.
 * @deprecated To be turned into a private variable.
 * @breaking-change 14.0.0
 */
export const CDK_DESCRIBEDBY_HOST_ATTRIBUTE = 'cdk-describedby-host';
/** Global incremental identifier for each registered message element. */
let nextId = 0;
/**
 * Utility that creates visually hidden elements with a message content. Useful for elements that
 * want to use aria-describedby to further describe themselves without adding additional visual
 * content.
 */
export class AriaDescriber {
    constructor(_document, 
    /**
     * @deprecated To be turned into a required parameter.
     * @breaking-change 14.0.0
     */
    _platform) {
        this._platform = _platform;
        /** Map of all registered message elements that have been placed into the document. */
        this._messageRegistry = new Map();
        /** Container for all registered messages. */
        this._messagesContainer = null;
        /** Unique ID for the service. */
        this._id = `${nextId++}`;
        this._document = _document;
    }
    describe(hostElement, message, role) {
        if (!this._canBeDescribed(hostElement, message)) {
            return;
        }
        const key = getKey(message, role);
        if (typeof message !== 'string') {
            // We need to ensure that the element has an ID.
            setMessageId(message);
            this._messageRegistry.set(key, { messageElement: message, referenceCount: 0 });
        }
        else if (!this._messageRegistry.has(key)) {
            this._createMessageElement(message, role);
        }
        if (!this._isElementDescribedByMessage(hostElement, key)) {
            this._addMessageReference(hostElement, key);
        }
    }
    removeDescription(hostElement, message, role) {
        if (!message || !this._isElementNode(hostElement)) {
            return;
        }
        const key = getKey(message, role);
        if (this._isElementDescribedByMessage(hostElement, key)) {
            this._removeMessageReference(hostElement, key);
        }
        // If the message is a string, it means that it's one that we created for the
        // consumer so we can remove it safely, otherwise we should leave it in place.
        if (typeof message === 'string') {
            const registeredMessage = this._messageRegistry.get(key);
            if (registeredMessage && registeredMessage.referenceCount === 0) {
                this._deleteMessageElement(key);
            }
        }
        if (this._messagesContainer?.childNodes.length === 0) {
            this._messagesContainer.remove();
            this._messagesContainer = null;
        }
    }
    /** Unregisters all created message elements and removes the message container. */
    ngOnDestroy() {
        const describedElements = this._document.querySelectorAll(`[${CDK_DESCRIBEDBY_HOST_ATTRIBUTE}="${this._id}"]`);
        for (let i = 0; i < describedElements.length; i++) {
            this._removeCdkDescribedByReferenceIds(describedElements[i]);
            describedElements[i].removeAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE);
        }
        this._messagesContainer?.remove();
        this._messagesContainer = null;
        this._messageRegistry.clear();
    }
    /**
     * Creates a new element in the visually hidden message container element with the message
     * as its content and adds it to the message registry.
     */
    _createMessageElement(message, role) {
        const messageElement = this._document.createElement('div');
        setMessageId(messageElement);
        messageElement.textContent = message;
        if (role) {
            messageElement.setAttribute('role', role);
        }
        this._createMessagesContainer();
        this._messagesContainer.appendChild(messageElement);
        this._messageRegistry.set(getKey(message, role), { messageElement, referenceCount: 0 });
    }
    /** Deletes the message element from the global messages container. */
    _deleteMessageElement(key) {
        this._messageRegistry.get(key)?.messageElement?.remove();
        this._messageRegistry.delete(key);
    }
    /** Creates the global container for all aria-describedby messages. */
    _createMessagesContainer() {
        if (this._messagesContainer) {
            return;
        }
        const containerClassName = 'cdk-describedby-message-container';
        const serverContainers = this._document.querySelectorAll(`.${containerClassName}[platform="server"]`);
        for (let i = 0; i < serverContainers.length; i++) {
            // When going from the server to the client, we may end up in a situation where there's
            // already a container on the page, but we don't have a reference to it. Clear the
            // old container so we don't get duplicates. Doing this, instead of emptying the previous
            // container, should be slightly faster.
            serverContainers[i].remove();
        }
        const messagesContainer = this._document.createElement('div');
        // We add `visibility: hidden` in order to prevent text in this container from
        // being searchable by the browser's Ctrl + F functionality.
        // Screen-readers will still read the description for elements with aria-describedby even
        // when the description element is not visible.
        messagesContainer.style.visibility = 'hidden';
        // Even though we use `visibility: hidden`, we still apply `cdk-visually-hidden` so that
        // the description element doesn't impact page layout.
        messagesContainer.classList.add(containerClassName);
        messagesContainer.classList.add('cdk-visually-hidden');
        // @breaking-change 14.0.0 Remove null check for `_platform`.
        if (this._platform && !this._platform.isBrowser) {
            messagesContainer.setAttribute('platform', 'server');
        }
        this._document.body.appendChild(messagesContainer);
        this._messagesContainer = messagesContainer;
    }
    /** Removes all cdk-describedby messages that are hosted through the element. */
    _removeCdkDescribedByReferenceIds(element) {
        // Remove all aria-describedby reference IDs that are prefixed by CDK_DESCRIBEDBY_ID_PREFIX
        const originalReferenceIds = getAriaReferenceIds(element, 'aria-describedby').filter(id => id.indexOf(CDK_DESCRIBEDBY_ID_PREFIX) != 0);
        element.setAttribute('aria-describedby', originalReferenceIds.join(' '));
    }
    /**
     * Adds a message reference to the element using aria-describedby and increments the registered
     * message's reference count.
     */
    _addMessageReference(element, key) {
        const registeredMessage = this._messageRegistry.get(key);
        // Add the aria-describedby reference and set the
        // describedby_host attribute to mark the element.
        addAriaReferencedId(element, 'aria-describedby', registeredMessage.messageElement.id);
        element.setAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE, this._id);
        registeredMessage.referenceCount++;
    }
    /**
     * Removes a message reference from the element using aria-describedby
     * and decrements the registered message's reference count.
     */
    _removeMessageReference(element, key) {
        const registeredMessage = this._messageRegistry.get(key);
        registeredMessage.referenceCount--;
        removeAriaReferencedId(element, 'aria-describedby', registeredMessage.messageElement.id);
        element.removeAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE);
    }
    /** Returns true if the element has been described by the provided message ID. */
    _isElementDescribedByMessage(element, key) {
        const referenceIds = getAriaReferenceIds(element, 'aria-describedby');
        const registeredMessage = this._messageRegistry.get(key);
        const messageId = registeredMessage && registeredMessage.messageElement.id;
        return !!messageId && referenceIds.indexOf(messageId) != -1;
    }
    /** Determines whether a message can be described on a particular element. */
    _canBeDescribed(element, message) {
        if (!this._isElementNode(element)) {
            return false;
        }
        if (message && typeof message === 'object') {
            // We'd have to make some assumptions about the description element's text, if the consumer
            // passed in an element. Assume that if an element is passed in, the consumer has verified
            // that it can be used as a description.
            return true;
        }
        const trimmedMessage = message == null ? '' : `${message}`.trim();
        const ariaLabel = element.getAttribute('aria-label');
        // We shouldn't set descriptions if they're exactly the same as the `aria-label` of the
        // element, because screen readers will end up reading out the same text twice in a row.
        return trimmedMessage ? !ariaLabel || ariaLabel.trim() !== trimmedMessage : false;
    }
    /** Checks whether a node is an Element node. */
    _isElementNode(element) {
        return element.nodeType === this._document.ELEMENT_NODE;
    }
}
AriaDescriber.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AriaDescriber, deps: [{ token: DOCUMENT }, { token: i1.Platform }], target: i0.ɵɵFactoryTarget.Injectable });
AriaDescriber.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AriaDescriber, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AriaDescriber, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.Platform }]; } });
/** Gets a key that can be used to look messages up in the registry. */
function getKey(message, role) {
    return typeof message === 'string' ? `${role || ''}/${message}` : message;
}
/** Assigns a unique ID to an element, if it doesn't have one already. */
function setMessageId(element) {
    if (!element.id) {
        element.id = `${CDK_DESCRIBEDBY_ID_PREFIX}-${nextId++}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJpYS1kZXNjcmliZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL2ExMXkvYXJpYS1kZXNjcmliZXIvYXJpYS1kZXNjcmliZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsc0JBQXNCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQzs7O0FBY2xHOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBRyxtQ0FBbUMsQ0FBQztBQUV6RTs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQUcseUJBQXlCLENBQUM7QUFFbkU7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLDhCQUE4QixHQUFHLHNCQUFzQixDQUFDO0FBRXJFLHlFQUF5RTtBQUN6RSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFZjs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLGFBQWE7SUFZeEIsWUFDb0IsU0FBYztJQUNoQzs7O09BR0c7SUFDSyxTQUFvQjtRQUFwQixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBZjlCLHNGQUFzRjtRQUM5RSxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBdUMsQ0FBQztRQUUxRSw2Q0FBNkM7UUFDckMsdUJBQWtCLEdBQXVCLElBQUksQ0FBQztRQUV0RCxpQ0FBaUM7UUFDaEIsUUFBRyxHQUFHLEdBQUcsTUFBTSxFQUFFLEVBQUUsQ0FBQztRQVVuQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBY0QsUUFBUSxDQUFDLFdBQW9CLEVBQUUsT0FBNkIsRUFBRSxJQUFhO1FBQ3pFLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsRUFBRTtZQUMvQyxPQUFPO1NBQ1I7UUFFRCxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWxDLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQy9CLGdEQUFnRDtZQUNoRCxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBQyxjQUFjLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1NBQzlFO2FBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDMUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMzQztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ3hELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDO0lBUUQsaUJBQWlCLENBQUMsV0FBb0IsRUFBRSxPQUE2QixFQUFFLElBQWE7UUFDbEYsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDakQsT0FBTztTQUNSO1FBRUQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVsQyxJQUFJLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDdkQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNoRDtRQUVELDZFQUE2RTtRQUM3RSw4RUFBOEU7UUFDOUUsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDL0IsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pELElBQUksaUJBQWlCLElBQUksaUJBQWlCLENBQUMsY0FBYyxLQUFLLENBQUMsRUFBRTtnQkFDL0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2pDO1NBQ0Y7UUFFRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNwRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQztTQUNoQztJQUNILENBQUM7SUFFRCxrRkFBa0Y7SUFDbEYsV0FBVztRQUNULE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FDdkQsSUFBSSw4QkFBOEIsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQ3BELENBQUM7UUFFRixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2pELElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdELGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1NBQ3RFO1FBRUQsSUFBSSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7UUFDL0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7O09BR0c7SUFDSyxxQkFBcUIsQ0FBQyxPQUFlLEVBQUUsSUFBYTtRQUMxRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzRCxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0IsY0FBYyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFFckMsSUFBSSxJQUFJLEVBQUU7WUFDUixjQUFjLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMzQztRQUVELElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxrQkFBbUIsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUMsY0FBYyxFQUFFLGNBQWMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFFRCxzRUFBc0U7SUFDOUQscUJBQXFCLENBQUMsR0FBcUI7UUFDakQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDekQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsc0VBQXNFO0lBQzlELHdCQUF3QjtRQUM5QixJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtZQUMzQixPQUFPO1NBQ1I7UUFFRCxNQUFNLGtCQUFrQixHQUFHLG1DQUFtQyxDQUFDO1FBQy9ELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FDdEQsSUFBSSxrQkFBa0IscUJBQXFCLENBQzVDLENBQUM7UUFFRixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hELHVGQUF1RjtZQUN2RixrRkFBa0Y7WUFDbEYseUZBQXlGO1lBQ3pGLHdDQUF3QztZQUN4QyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUM5QjtRQUVELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFOUQsOEVBQThFO1FBQzlFLDREQUE0RDtRQUM1RCx5RkFBeUY7UUFDekYsK0NBQStDO1FBQy9DLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQzlDLHdGQUF3RjtRQUN4RixzREFBc0Q7UUFDdEQsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3BELGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUV2RCw2REFBNkQ7UUFDN0QsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUU7WUFDL0MsaUJBQWlCLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUN0RDtRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQztJQUM5QyxDQUFDO0lBRUQsZ0ZBQWdGO0lBQ3hFLGlDQUFpQyxDQUFDLE9BQWdCO1FBQ3hELDJGQUEyRjtRQUMzRixNQUFNLG9CQUFvQixHQUFHLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sQ0FDbEYsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUNqRCxDQUFDO1FBQ0YsT0FBTyxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssb0JBQW9CLENBQUMsT0FBZ0IsRUFBRSxHQUFxQjtRQUNsRSxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFFLENBQUM7UUFFMUQsaURBQWlEO1FBQ2pELGtEQUFrRDtRQUNsRCxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsaUJBQWlCLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLE9BQU8sQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9ELGlCQUFpQixDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7O09BR0c7SUFDSyx1QkFBdUIsQ0FBQyxPQUFnQixFQUFFLEdBQXFCO1FBQ3JFLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUUsQ0FBQztRQUMxRCxpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUVuQyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsaUJBQWlCLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pGLE9BQU8sQ0FBQyxlQUFlLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsaUZBQWlGO0lBQ3pFLDRCQUE0QixDQUFDLE9BQWdCLEVBQUUsR0FBcUI7UUFDMUUsTUFBTSxZQUFZLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDdEUsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sU0FBUyxHQUFHLGlCQUFpQixJQUFJLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUM7UUFFM0UsT0FBTyxDQUFDLENBQUMsU0FBUyxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELDZFQUE2RTtJQUNyRSxlQUFlLENBQUMsT0FBZ0IsRUFBRSxPQUFvQztRQUM1RSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQyxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQzFDLDJGQUEyRjtZQUMzRiwwRkFBMEY7WUFDMUYsd0NBQXdDO1lBQ3hDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxNQUFNLGNBQWMsR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbEUsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVyRCx1RkFBdUY7UUFDdkYsd0ZBQXdGO1FBQ3hGLE9BQU8sY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssY0FBYyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDcEYsQ0FBQztJQUVELGdEQUFnRDtJQUN4QyxjQUFjLENBQUMsT0FBYTtRQUNsQyxPQUFPLE9BQU8sQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7SUFDMUQsQ0FBQzs7MEdBM09VLGFBQWEsa0JBYWQsUUFBUTs4R0FiUCxhQUFhLGNBREQsTUFBTTsyRkFDbEIsYUFBYTtrQkFEekIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7OzBCQWMzQixNQUFNOzJCQUFDLFFBQVE7O0FBaU9wQix1RUFBdUU7QUFDdkUsU0FBUyxNQUFNLENBQUMsT0FBeUIsRUFBRSxJQUFhO0lBQ3RELE9BQU8sT0FBTyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLElBQUksT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUM1RSxDQUFDO0FBRUQseUVBQXlFO0FBQ3pFLFNBQVMsWUFBWSxDQUFDLE9BQW9CO0lBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFO1FBQ2YsT0FBTyxDQUFDLEVBQUUsR0FBRyxHQUFHLHlCQUF5QixJQUFJLE1BQU0sRUFBRSxFQUFFLENBQUM7S0FDekQ7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgT25EZXN0cm95fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge2FkZEFyaWFSZWZlcmVuY2VkSWQsIGdldEFyaWFSZWZlcmVuY2VJZHMsIHJlbW92ZUFyaWFSZWZlcmVuY2VkSWR9IGZyb20gJy4vYXJpYS1yZWZlcmVuY2UnO1xuXG4vKipcbiAqIEludGVyZmFjZSB1c2VkIHRvIHJlZ2lzdGVyIG1lc3NhZ2UgZWxlbWVudHMgYW5kIGtlZXAgYSBjb3VudCBvZiBob3cgbWFueSByZWdpc3RyYXRpb25zIGhhdmVcbiAqIHRoZSBzYW1lIG1lc3NhZ2UgYW5kIHRoZSByZWZlcmVuY2UgdG8gdGhlIG1lc3NhZ2UgZWxlbWVudCB1c2VkIGZvciB0aGUgYGFyaWEtZGVzY3JpYmVkYnlgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlZ2lzdGVyZWRNZXNzYWdlIHtcbiAgLyoqIFRoZSBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIG1lc3NhZ2UuICovXG4gIG1lc3NhZ2VFbGVtZW50OiBFbGVtZW50O1xuXG4gIC8qKiBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRoYXQgcmVmZXJlbmNlIHRoaXMgbWVzc2FnZSBlbGVtZW50IHZpYSBgYXJpYS1kZXNjcmliZWRieWAuICovXG4gIHJlZmVyZW5jZUNvdW50OiBudW1iZXI7XG59XG5cbi8qKlxuICogSUQgdXNlZCBmb3IgdGhlIGJvZHkgY29udGFpbmVyIHdoZXJlIGFsbCBtZXNzYWdlcyBhcmUgYXBwZW5kZWQuXG4gKiBAZGVwcmVjYXRlZCBObyBsb25nZXIgYmVpbmcgdXNlZC4gVG8gYmUgcmVtb3ZlZC5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wXG4gKi9cbmV4cG9ydCBjb25zdCBNRVNTQUdFU19DT05UQUlORVJfSUQgPSAnY2RrLWRlc2NyaWJlZGJ5LW1lc3NhZ2UtY29udGFpbmVyJztcblxuLyoqXG4gKiBJRCBwcmVmaXggdXNlZCBmb3IgZWFjaCBjcmVhdGVkIG1lc3NhZ2UgZWxlbWVudC5cbiAqIEBkZXByZWNhdGVkIFRvIGJlIHR1cm5lZCBpbnRvIGEgcHJpdmF0ZSB2YXJpYWJsZS5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wXG4gKi9cbmV4cG9ydCBjb25zdCBDREtfREVTQ1JJQkVEQllfSURfUFJFRklYID0gJ2Nkay1kZXNjcmliZWRieS1tZXNzYWdlJztcblxuLyoqXG4gKiBBdHRyaWJ1dGUgZ2l2ZW4gdG8gZWFjaCBob3N0IGVsZW1lbnQgdGhhdCBpcyBkZXNjcmliZWQgYnkgYSBtZXNzYWdlIGVsZW1lbnQuXG4gKiBAZGVwcmVjYXRlZCBUbyBiZSB0dXJuZWQgaW50byBhIHByaXZhdGUgdmFyaWFibGUuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMFxuICovXG5leHBvcnQgY29uc3QgQ0RLX0RFU0NSSUJFREJZX0hPU1RfQVRUUklCVVRFID0gJ2Nkay1kZXNjcmliZWRieS1ob3N0JztcblxuLyoqIEdsb2JhbCBpbmNyZW1lbnRhbCBpZGVudGlmaWVyIGZvciBlYWNoIHJlZ2lzdGVyZWQgbWVzc2FnZSBlbGVtZW50LiAqL1xubGV0IG5leHRJZCA9IDA7XG5cbi8qKlxuICogVXRpbGl0eSB0aGF0IGNyZWF0ZXMgdmlzdWFsbHkgaGlkZGVuIGVsZW1lbnRzIHdpdGggYSBtZXNzYWdlIGNvbnRlbnQuIFVzZWZ1bCBmb3IgZWxlbWVudHMgdGhhdFxuICogd2FudCB0byB1c2UgYXJpYS1kZXNjcmliZWRieSB0byBmdXJ0aGVyIGRlc2NyaWJlIHRoZW1zZWx2ZXMgd2l0aG91dCBhZGRpbmcgYWRkaXRpb25hbCB2aXN1YWxcbiAqIGNvbnRlbnQuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIEFyaWFEZXNjcmliZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqIE1hcCBvZiBhbGwgcmVnaXN0ZXJlZCBtZXNzYWdlIGVsZW1lbnRzIHRoYXQgaGF2ZSBiZWVuIHBsYWNlZCBpbnRvIHRoZSBkb2N1bWVudC4gKi9cbiAgcHJpdmF0ZSBfbWVzc2FnZVJlZ2lzdHJ5ID0gbmV3IE1hcDxzdHJpbmcgfCBFbGVtZW50LCBSZWdpc3RlcmVkTWVzc2FnZT4oKTtcblxuICAvKiogQ29udGFpbmVyIGZvciBhbGwgcmVnaXN0ZXJlZCBtZXNzYWdlcy4gKi9cbiAgcHJpdmF0ZSBfbWVzc2FnZXNDb250YWluZXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFVuaXF1ZSBJRCBmb3IgdGhlIHNlcnZpY2UuICovXG4gIHByaXZhdGUgcmVhZG9ubHkgX2lkID0gYCR7bmV4dElkKyt9YDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBfZG9jdW1lbnQ6IGFueSxcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBUbyBiZSB0dXJuZWQgaW50byBhIHJlcXVpcmVkIHBhcmFtZXRlci5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDE0LjAuMFxuICAgICAqL1xuICAgIHByaXZhdGUgX3BsYXRmb3JtPzogUGxhdGZvcm0sXG4gICkge1xuICAgIHRoaXMuX2RvY3VtZW50ID0gX2RvY3VtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdG8gdGhlIGhvc3QgZWxlbWVudCBhbiBhcmlhLWRlc2NyaWJlZGJ5IHJlZmVyZW5jZSB0byBhIGhpZGRlbiBlbGVtZW50IHRoYXQgY29udGFpbnNcbiAgICogdGhlIG1lc3NhZ2UuIElmIHRoZSBzYW1lIG1lc3NhZ2UgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkLCB0aGVuIGl0IHdpbGwgcmV1c2UgdGhlIGNyZWF0ZWRcbiAgICogbWVzc2FnZSBlbGVtZW50LlxuICAgKi9cbiAgZGVzY3JpYmUoaG9zdEVsZW1lbnQ6IEVsZW1lbnQsIG1lc3NhZ2U6IHN0cmluZywgcm9sZT86IHN0cmluZyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgdG8gdGhlIGhvc3QgZWxlbWVudCBhbiBhcmlhLWRlc2NyaWJlZGJ5IHJlZmVyZW5jZSB0byBhbiBhbHJlYWR5LWV4aXN0aW5nIG1lc3NhZ2UgZWxlbWVudC5cbiAgICovXG4gIGRlc2NyaWJlKGhvc3RFbGVtZW50OiBFbGVtZW50LCBtZXNzYWdlOiBIVE1MRWxlbWVudCk6IHZvaWQ7XG5cbiAgZGVzY3JpYmUoaG9zdEVsZW1lbnQ6IEVsZW1lbnQsIG1lc3NhZ2U6IHN0cmluZyB8IEhUTUxFbGVtZW50LCByb2xlPzogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9jYW5CZURlc2NyaWJlZChob3N0RWxlbWVudCwgbWVzc2FnZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBrZXkgPSBnZXRLZXkobWVzc2FnZSwgcm9sZSk7XG5cbiAgICBpZiAodHlwZW9mIG1lc3NhZ2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIGVuc3VyZSB0aGF0IHRoZSBlbGVtZW50IGhhcyBhbiBJRC5cbiAgICAgIHNldE1lc3NhZ2VJZChtZXNzYWdlKTtcbiAgICAgIHRoaXMuX21lc3NhZ2VSZWdpc3RyeS5zZXQoa2V5LCB7bWVzc2FnZUVsZW1lbnQ6IG1lc3NhZ2UsIHJlZmVyZW5jZUNvdW50OiAwfSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5fbWVzc2FnZVJlZ2lzdHJ5LmhhcyhrZXkpKSB7XG4gICAgICB0aGlzLl9jcmVhdGVNZXNzYWdlRWxlbWVudChtZXNzYWdlLCByb2xlKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2lzRWxlbWVudERlc2NyaWJlZEJ5TWVzc2FnZShob3N0RWxlbWVudCwga2V5KSkge1xuICAgICAgdGhpcy5fYWRkTWVzc2FnZVJlZmVyZW5jZShob3N0RWxlbWVudCwga2V5KTtcbiAgICB9XG4gIH1cblxuICAvKiogUmVtb3ZlcyB0aGUgaG9zdCBlbGVtZW50J3MgYXJpYS1kZXNjcmliZWRieSByZWZlcmVuY2UgdG8gdGhlIG1lc3NhZ2UuICovXG4gIHJlbW92ZURlc2NyaXB0aW9uKGhvc3RFbGVtZW50OiBFbGVtZW50LCBtZXNzYWdlOiBzdHJpbmcsIHJvbGU/OiBzdHJpbmcpOiB2b2lkO1xuXG4gIC8qKiBSZW1vdmVzIHRoZSBob3N0IGVsZW1lbnQncyBhcmlhLWRlc2NyaWJlZGJ5IHJlZmVyZW5jZSB0byB0aGUgbWVzc2FnZSBlbGVtZW50LiAqL1xuICByZW1vdmVEZXNjcmlwdGlvbihob3N0RWxlbWVudDogRWxlbWVudCwgbWVzc2FnZTogSFRNTEVsZW1lbnQpOiB2b2lkO1xuXG4gIHJlbW92ZURlc2NyaXB0aW9uKGhvc3RFbGVtZW50OiBFbGVtZW50LCBtZXNzYWdlOiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgcm9sZT86IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghbWVzc2FnZSB8fCAhdGhpcy5faXNFbGVtZW50Tm9kZShob3N0RWxlbWVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBrZXkgPSBnZXRLZXkobWVzc2FnZSwgcm9sZSk7XG5cbiAgICBpZiAodGhpcy5faXNFbGVtZW50RGVzY3JpYmVkQnlNZXNzYWdlKGhvc3RFbGVtZW50LCBrZXkpKSB7XG4gICAgICB0aGlzLl9yZW1vdmVNZXNzYWdlUmVmZXJlbmNlKGhvc3RFbGVtZW50LCBrZXkpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBtZXNzYWdlIGlzIGEgc3RyaW5nLCBpdCBtZWFucyB0aGF0IGl0J3Mgb25lIHRoYXQgd2UgY3JlYXRlZCBmb3IgdGhlXG4gICAgLy8gY29uc3VtZXIgc28gd2UgY2FuIHJlbW92ZSBpdCBzYWZlbHksIG90aGVyd2lzZSB3ZSBzaG91bGQgbGVhdmUgaXQgaW4gcGxhY2UuXG4gICAgaWYgKHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgcmVnaXN0ZXJlZE1lc3NhZ2UgPSB0aGlzLl9tZXNzYWdlUmVnaXN0cnkuZ2V0KGtleSk7XG4gICAgICBpZiAocmVnaXN0ZXJlZE1lc3NhZ2UgJiYgcmVnaXN0ZXJlZE1lc3NhZ2UucmVmZXJlbmNlQ291bnQgPT09IDApIHtcbiAgICAgICAgdGhpcy5fZGVsZXRlTWVzc2FnZUVsZW1lbnQoa2V5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbWVzc2FnZXNDb250YWluZXI/LmNoaWxkTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLl9tZXNzYWdlc0NvbnRhaW5lci5yZW1vdmUoKTtcbiAgICAgIHRoaXMuX21lc3NhZ2VzQ29udGFpbmVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKiogVW5yZWdpc3RlcnMgYWxsIGNyZWF0ZWQgbWVzc2FnZSBlbGVtZW50cyBhbmQgcmVtb3ZlcyB0aGUgbWVzc2FnZSBjb250YWluZXIuICovXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGRlc2NyaWJlZEVsZW1lbnRzID0gdGhpcy5fZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgIGBbJHtDREtfREVTQ1JJQkVEQllfSE9TVF9BVFRSSUJVVEV9PVwiJHt0aGlzLl9pZH1cIl1gLFxuICAgICk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlc2NyaWJlZEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLl9yZW1vdmVDZGtEZXNjcmliZWRCeVJlZmVyZW5jZUlkcyhkZXNjcmliZWRFbGVtZW50c1tpXSk7XG4gICAgICBkZXNjcmliZWRFbGVtZW50c1tpXS5yZW1vdmVBdHRyaWJ1dGUoQ0RLX0RFU0NSSUJFREJZX0hPU1RfQVRUUklCVVRFKTtcbiAgICB9XG5cbiAgICB0aGlzLl9tZXNzYWdlc0NvbnRhaW5lcj8ucmVtb3ZlKCk7XG4gICAgdGhpcy5fbWVzc2FnZXNDb250YWluZXIgPSBudWxsO1xuICAgIHRoaXMuX21lc3NhZ2VSZWdpc3RyeS5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgZWxlbWVudCBpbiB0aGUgdmlzdWFsbHkgaGlkZGVuIG1lc3NhZ2UgY29udGFpbmVyIGVsZW1lbnQgd2l0aCB0aGUgbWVzc2FnZVxuICAgKiBhcyBpdHMgY29udGVudCBhbmQgYWRkcyBpdCB0byB0aGUgbWVzc2FnZSByZWdpc3RyeS5cbiAgICovXG4gIHByaXZhdGUgX2NyZWF0ZU1lc3NhZ2VFbGVtZW50KG1lc3NhZ2U6IHN0cmluZywgcm9sZT86IHN0cmluZykge1xuICAgIGNvbnN0IG1lc3NhZ2VFbGVtZW50ID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc2V0TWVzc2FnZUlkKG1lc3NhZ2VFbGVtZW50KTtcbiAgICBtZXNzYWdlRWxlbWVudC50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cbiAgICBpZiAocm9sZSkge1xuICAgICAgbWVzc2FnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdyb2xlJywgcm9sZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fY3JlYXRlTWVzc2FnZXNDb250YWluZXIoKTtcbiAgICB0aGlzLl9tZXNzYWdlc0NvbnRhaW5lciEuYXBwZW5kQ2hpbGQobWVzc2FnZUVsZW1lbnQpO1xuICAgIHRoaXMuX21lc3NhZ2VSZWdpc3RyeS5zZXQoZ2V0S2V5KG1lc3NhZ2UsIHJvbGUpLCB7bWVzc2FnZUVsZW1lbnQsIHJlZmVyZW5jZUNvdW50OiAwfSk7XG4gIH1cblxuICAvKiogRGVsZXRlcyB0aGUgbWVzc2FnZSBlbGVtZW50IGZyb20gdGhlIGdsb2JhbCBtZXNzYWdlcyBjb250YWluZXIuICovXG4gIHByaXZhdGUgX2RlbGV0ZU1lc3NhZ2VFbGVtZW50KGtleTogc3RyaW5nIHwgRWxlbWVudCkge1xuICAgIHRoaXMuX21lc3NhZ2VSZWdpc3RyeS5nZXQoa2V5KT8ubWVzc2FnZUVsZW1lbnQ/LnJlbW92ZSgpO1xuICAgIHRoaXMuX21lc3NhZ2VSZWdpc3RyeS5kZWxldGUoa2V5KTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIHRoZSBnbG9iYWwgY29udGFpbmVyIGZvciBhbGwgYXJpYS1kZXNjcmliZWRieSBtZXNzYWdlcy4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlTWVzc2FnZXNDb250YWluZXIoKSB7XG4gICAgaWYgKHRoaXMuX21lc3NhZ2VzQ29udGFpbmVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29udGFpbmVyQ2xhc3NOYW1lID0gJ2Nkay1kZXNjcmliZWRieS1tZXNzYWdlLWNvbnRhaW5lcic7XG4gICAgY29uc3Qgc2VydmVyQ29udGFpbmVycyA9IHRoaXMuX2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICBgLiR7Y29udGFpbmVyQ2xhc3NOYW1lfVtwbGF0Zm9ybT1cInNlcnZlclwiXWAsXG4gICAgKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VydmVyQ29udGFpbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gV2hlbiBnb2luZyBmcm9tIHRoZSBzZXJ2ZXIgdG8gdGhlIGNsaWVudCwgd2UgbWF5IGVuZCB1cCBpbiBhIHNpdHVhdGlvbiB3aGVyZSB0aGVyZSdzXG4gICAgICAvLyBhbHJlYWR5IGEgY29udGFpbmVyIG9uIHRoZSBwYWdlLCBidXQgd2UgZG9uJ3QgaGF2ZSBhIHJlZmVyZW5jZSB0byBpdC4gQ2xlYXIgdGhlXG4gICAgICAvLyBvbGQgY29udGFpbmVyIHNvIHdlIGRvbid0IGdldCBkdXBsaWNhdGVzLiBEb2luZyB0aGlzLCBpbnN0ZWFkIG9mIGVtcHR5aW5nIHRoZSBwcmV2aW91c1xuICAgICAgLy8gY29udGFpbmVyLCBzaG91bGQgYmUgc2xpZ2h0bHkgZmFzdGVyLlxuICAgICAgc2VydmVyQ29udGFpbmVyc1tpXS5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlc0NvbnRhaW5lciA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgLy8gV2UgYWRkIGB2aXNpYmlsaXR5OiBoaWRkZW5gIGluIG9yZGVyIHRvIHByZXZlbnQgdGV4dCBpbiB0aGlzIGNvbnRhaW5lciBmcm9tXG4gICAgLy8gYmVpbmcgc2VhcmNoYWJsZSBieSB0aGUgYnJvd3NlcidzIEN0cmwgKyBGIGZ1bmN0aW9uYWxpdHkuXG4gICAgLy8gU2NyZWVuLXJlYWRlcnMgd2lsbCBzdGlsbCByZWFkIHRoZSBkZXNjcmlwdGlvbiBmb3IgZWxlbWVudHMgd2l0aCBhcmlhLWRlc2NyaWJlZGJ5IGV2ZW5cbiAgICAvLyB3aGVuIHRoZSBkZXNjcmlwdGlvbiBlbGVtZW50IGlzIG5vdCB2aXNpYmxlLlxuICAgIG1lc3NhZ2VzQ29udGFpbmVyLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAvLyBFdmVuIHRob3VnaCB3ZSB1c2UgYHZpc2liaWxpdHk6IGhpZGRlbmAsIHdlIHN0aWxsIGFwcGx5IGBjZGstdmlzdWFsbHktaGlkZGVuYCBzbyB0aGF0XG4gICAgLy8gdGhlIGRlc2NyaXB0aW9uIGVsZW1lbnQgZG9lc24ndCBpbXBhY3QgcGFnZSBsYXlvdXQuXG4gICAgbWVzc2FnZXNDb250YWluZXIuY2xhc3NMaXN0LmFkZChjb250YWluZXJDbGFzc05hbWUpO1xuICAgIG1lc3NhZ2VzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2Nkay12aXN1YWxseS1oaWRkZW4nKTtcblxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTQuMC4wIFJlbW92ZSBudWxsIGNoZWNrIGZvciBgX3BsYXRmb3JtYC5cbiAgICBpZiAodGhpcy5fcGxhdGZvcm0gJiYgIXRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgbWVzc2FnZXNDb250YWluZXIuc2V0QXR0cmlidXRlKCdwbGF0Zm9ybScsICdzZXJ2ZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1lc3NhZ2VzQ29udGFpbmVyKTtcbiAgICB0aGlzLl9tZXNzYWdlc0NvbnRhaW5lciA9IG1lc3NhZ2VzQ29udGFpbmVyO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgYWxsIGNkay1kZXNjcmliZWRieSBtZXNzYWdlcyB0aGF0IGFyZSBob3N0ZWQgdGhyb3VnaCB0aGUgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlQ2RrRGVzY3JpYmVkQnlSZWZlcmVuY2VJZHMoZWxlbWVudDogRWxlbWVudCkge1xuICAgIC8vIFJlbW92ZSBhbGwgYXJpYS1kZXNjcmliZWRieSByZWZlcmVuY2UgSURzIHRoYXQgYXJlIHByZWZpeGVkIGJ5IENES19ERVNDUklCRURCWV9JRF9QUkVGSVhcbiAgICBjb25zdCBvcmlnaW5hbFJlZmVyZW5jZUlkcyA9IGdldEFyaWFSZWZlcmVuY2VJZHMoZWxlbWVudCwgJ2FyaWEtZGVzY3JpYmVkYnknKS5maWx0ZXIoXG4gICAgICBpZCA9PiBpZC5pbmRleE9mKENES19ERVNDUklCRURCWV9JRF9QUkVGSVgpICE9IDAsXG4gICAgKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1kZXNjcmliZWRieScsIG9yaWdpbmFsUmVmZXJlbmNlSWRzLmpvaW4oJyAnKSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG1lc3NhZ2UgcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IHVzaW5nIGFyaWEtZGVzY3JpYmVkYnkgYW5kIGluY3JlbWVudHMgdGhlIHJlZ2lzdGVyZWRcbiAgICogbWVzc2FnZSdzIHJlZmVyZW5jZSBjb3VudC5cbiAgICovXG4gIHByaXZhdGUgX2FkZE1lc3NhZ2VSZWZlcmVuY2UoZWxlbWVudDogRWxlbWVudCwga2V5OiBzdHJpbmcgfCBFbGVtZW50KSB7XG4gICAgY29uc3QgcmVnaXN0ZXJlZE1lc3NhZ2UgPSB0aGlzLl9tZXNzYWdlUmVnaXN0cnkuZ2V0KGtleSkhO1xuXG4gICAgLy8gQWRkIHRoZSBhcmlhLWRlc2NyaWJlZGJ5IHJlZmVyZW5jZSBhbmQgc2V0IHRoZVxuICAgIC8vIGRlc2NyaWJlZGJ5X2hvc3QgYXR0cmlidXRlIHRvIG1hcmsgdGhlIGVsZW1lbnQuXG4gICAgYWRkQXJpYVJlZmVyZW5jZWRJZChlbGVtZW50LCAnYXJpYS1kZXNjcmliZWRieScsIHJlZ2lzdGVyZWRNZXNzYWdlLm1lc3NhZ2VFbGVtZW50LmlkKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShDREtfREVTQ1JJQkVEQllfSE9TVF9BVFRSSUJVVEUsIHRoaXMuX2lkKTtcbiAgICByZWdpc3RlcmVkTWVzc2FnZS5yZWZlcmVuY2VDb3VudCsrO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBtZXNzYWdlIHJlZmVyZW5jZSBmcm9tIHRoZSBlbGVtZW50IHVzaW5nIGFyaWEtZGVzY3JpYmVkYnlcbiAgICogYW5kIGRlY3JlbWVudHMgdGhlIHJlZ2lzdGVyZWQgbWVzc2FnZSdzIHJlZmVyZW5jZSBjb3VudC5cbiAgICovXG4gIHByaXZhdGUgX3JlbW92ZU1lc3NhZ2VSZWZlcmVuY2UoZWxlbWVudDogRWxlbWVudCwga2V5OiBzdHJpbmcgfCBFbGVtZW50KSB7XG4gICAgY29uc3QgcmVnaXN0ZXJlZE1lc3NhZ2UgPSB0aGlzLl9tZXNzYWdlUmVnaXN0cnkuZ2V0KGtleSkhO1xuICAgIHJlZ2lzdGVyZWRNZXNzYWdlLnJlZmVyZW5jZUNvdW50LS07XG5cbiAgICByZW1vdmVBcmlhUmVmZXJlbmNlZElkKGVsZW1lbnQsICdhcmlhLWRlc2NyaWJlZGJ5JywgcmVnaXN0ZXJlZE1lc3NhZ2UubWVzc2FnZUVsZW1lbnQuaWQpO1xuICAgIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKENES19ERVNDUklCRURCWV9IT1NUX0FUVFJJQlVURSk7XG4gIH1cblxuICAvKiogUmV0dXJucyB0cnVlIGlmIHRoZSBlbGVtZW50IGhhcyBiZWVuIGRlc2NyaWJlZCBieSB0aGUgcHJvdmlkZWQgbWVzc2FnZSBJRC4gKi9cbiAgcHJpdmF0ZSBfaXNFbGVtZW50RGVzY3JpYmVkQnlNZXNzYWdlKGVsZW1lbnQ6IEVsZW1lbnQsIGtleTogc3RyaW5nIHwgRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJlZmVyZW5jZUlkcyA9IGdldEFyaWFSZWZlcmVuY2VJZHMoZWxlbWVudCwgJ2FyaWEtZGVzY3JpYmVkYnknKTtcbiAgICBjb25zdCByZWdpc3RlcmVkTWVzc2FnZSA9IHRoaXMuX21lc3NhZ2VSZWdpc3RyeS5nZXQoa2V5KTtcbiAgICBjb25zdCBtZXNzYWdlSWQgPSByZWdpc3RlcmVkTWVzc2FnZSAmJiByZWdpc3RlcmVkTWVzc2FnZS5tZXNzYWdlRWxlbWVudC5pZDtcblxuICAgIHJldHVybiAhIW1lc3NhZ2VJZCAmJiByZWZlcmVuY2VJZHMuaW5kZXhPZihtZXNzYWdlSWQpICE9IC0xO1xuICB9XG5cbiAgLyoqIERldGVybWluZXMgd2hldGhlciBhIG1lc3NhZ2UgY2FuIGJlIGRlc2NyaWJlZCBvbiBhIHBhcnRpY3VsYXIgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfY2FuQmVEZXNjcmliZWQoZWxlbWVudDogRWxlbWVudCwgbWVzc2FnZTogc3RyaW5nIHwgSFRNTEVsZW1lbnQgfCB2b2lkKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLl9pc0VsZW1lbnROb2RlKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UgJiYgdHlwZW9mIG1lc3NhZ2UgPT09ICdvYmplY3QnKSB7XG4gICAgICAvLyBXZSdkIGhhdmUgdG8gbWFrZSBzb21lIGFzc3VtcHRpb25zIGFib3V0IHRoZSBkZXNjcmlwdGlvbiBlbGVtZW50J3MgdGV4dCwgaWYgdGhlIGNvbnN1bWVyXG4gICAgICAvLyBwYXNzZWQgaW4gYW4gZWxlbWVudC4gQXNzdW1lIHRoYXQgaWYgYW4gZWxlbWVudCBpcyBwYXNzZWQgaW4sIHRoZSBjb25zdW1lciBoYXMgdmVyaWZpZWRcbiAgICAgIC8vIHRoYXQgaXQgY2FuIGJlIHVzZWQgYXMgYSBkZXNjcmlwdGlvbi5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IHRyaW1tZWRNZXNzYWdlID0gbWVzc2FnZSA9PSBudWxsID8gJycgOiBgJHttZXNzYWdlfWAudHJpbSgpO1xuICAgIGNvbnN0IGFyaWFMYWJlbCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG5cbiAgICAvLyBXZSBzaG91bGRuJ3Qgc2V0IGRlc2NyaXB0aW9ucyBpZiB0aGV5J3JlIGV4YWN0bHkgdGhlIHNhbWUgYXMgdGhlIGBhcmlhLWxhYmVsYCBvZiB0aGVcbiAgICAvLyBlbGVtZW50LCBiZWNhdXNlIHNjcmVlbiByZWFkZXJzIHdpbGwgZW5kIHVwIHJlYWRpbmcgb3V0IHRoZSBzYW1lIHRleHQgdHdpY2UgaW4gYSByb3cuXG4gICAgcmV0dXJuIHRyaW1tZWRNZXNzYWdlID8gIWFyaWFMYWJlbCB8fCBhcmlhTGFiZWwudHJpbSgpICE9PSB0cmltbWVkTWVzc2FnZSA6IGZhbHNlO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIGEgbm9kZSBpcyBhbiBFbGVtZW50IG5vZGUuICovXG4gIHByaXZhdGUgX2lzRWxlbWVudE5vZGUoZWxlbWVudDogTm9kZSk6IGVsZW1lbnQgaXMgRWxlbWVudCB7XG4gICAgcmV0dXJuIGVsZW1lbnQubm9kZVR5cGUgPT09IHRoaXMuX2RvY3VtZW50LkVMRU1FTlRfTk9ERTtcbiAgfVxufVxuXG4vKiogR2V0cyBhIGtleSB0aGF0IGNhbiBiZSB1c2VkIHRvIGxvb2sgbWVzc2FnZXMgdXAgaW4gdGhlIHJlZ2lzdHJ5LiAqL1xuZnVuY3Rpb24gZ2V0S2V5KG1lc3NhZ2U6IHN0cmluZyB8IEVsZW1lbnQsIHJvbGU/OiBzdHJpbmcpOiBzdHJpbmcgfCBFbGVtZW50IHtcbiAgcmV0dXJuIHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJyA/IGAke3JvbGUgfHwgJyd9LyR7bWVzc2FnZX1gIDogbWVzc2FnZTtcbn1cblxuLyoqIEFzc2lnbnMgYSB1bmlxdWUgSUQgdG8gYW4gZWxlbWVudCwgaWYgaXQgZG9lc24ndCBoYXZlIG9uZSBhbHJlYWR5LiAqL1xuZnVuY3Rpb24gc2V0TWVzc2FnZUlkKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gIGlmICghZWxlbWVudC5pZCkge1xuICAgIGVsZW1lbnQuaWQgPSBgJHtDREtfREVTQ1JJQkVEQllfSURfUFJFRklYfS0ke25leHRJZCsrfWA7XG4gIH1cbn1cbiJdfQ==