import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { perfNow } from 'src/app/util/util';

@Component({
  selector: 'app-selectable-list',
  templateUrl: './selectable-list.component.html',
  styleUrls: ['./selectable-list.component.css'],
})
export class SelectableListComponent {
  @Input() title: string = '';
  @Input() items: string[] = [];
  @Input() selectedItem: string | null = null;
  @Input() highlightedItems: string[] = [];
  @Input() canEdit = true;
  @Input() editMode = false;
  @Input() addLabel = 'Add';
  @Input() typeLabel = '';
  @Input() relationshipEditMode = false;
  @Output() itemSelected = new EventEmitter<string>();
  @Output() addItem = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() renameItem = new EventEmitter<{ oldName: string; newName: string }>();
  @Output() deleteItem = new EventEmitter<string>();
  @Output() relationshipToggle = new EventEmitter<string>();
  @Output() editModeChange = new EventEmitter<boolean>();

  @ViewChild('editInput') editInputRef: ElementRef<HTMLInputElement> | undefined;

  editingName: string = '';
  editingOrgName: string = '';

  onItemClicked(name: string) {
    console.log(`Item clicked: ${name}`);
    if (!this.relationshipEditMode) {
      this.itemSelected.emit(name);
    } else {
      this.relationshipToggle.emit(name);
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      if (!this.selectedItem && this.items.length > 0) {
        this.onItemClicked(this.items[0]);
      }
    }
    this.editModeChange.emit(this.editMode);
  }

  startEditItem(name: string) {
    this.editingName = name;
    this.editingOrgName = name;
    this.itemSelected.emit(name); // Select the item when editing starts
    setTimeout(() => {
      if (this.editInputRef) {
        this.editInputRef.nativeElement.focus();
        this.editInputRef.nativeElement.select();
      }
    });
  }

  cancelEditItem(oldName: string) {
    console.log(`${perfNow()}: Cancel editing: ${oldName}`);
    this.editingName = '';
    this.editingOrgName = '';
  }

  saveEditedItem(oldName: string) {
    let newName: string = this.editingName?.trim() || oldName;
    console.log(`${perfNow()}: Save Item: Setting new name: ${newName}`);
    if (this.editingName?.trim() && this.editingName !== oldName) {
      this.renameItem.emit({ oldName, newName });
    }
    this.editingName = '';
    this.editingOrgName = '';
  }

  deleteListItem(name: string) {
    console.log(`${perfNow()}: Delete Item: ${name}`);
    let index: number = this.items.indexOf(name);
    this.deleteItem.emit(name);

    // Select next item
    if (index < this.items.length - 1) {
      this.onItemClicked(this.items[index + 1]);
    } else if (index > 0) {
      this.onItemClicked(this.items[index - 1]);
    }
  }
}
