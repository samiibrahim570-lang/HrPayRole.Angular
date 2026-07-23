import { Component } from '@angular/core';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent {
  activeTab: 'list' | 'form' = 'list';
  editGlobalId: string | null = null;

  onAddUser(): void {
    this.editGlobalId = null;
    this.activeTab = 'form';
  }

  onEditUser(globalId: string): void {
    this.editGlobalId = globalId;
    this.activeTab = 'form';
  }

  onFormDone(): void {
    this.editGlobalId = null;
    this.activeTab = 'list';
  }
}
