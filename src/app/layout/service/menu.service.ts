import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { MenuItem, RolePagePermission, RoleResponse } from '../interface/menu-item';
import { ResponseModel } from 'src/app/shared/interface/ResponsemodelArray';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = environment.apiUrl;
  private menuKey = 'menuData';

  private menuSubject = new BehaviorSubject<MenuItem[]>(this.loadFromStorage());
  menu$ = this.menuSubject.asObservable();

  constructor(private http: HttpClient) { }

  getRoleMenu(roleId: number): Observable<ResponseModel<RoleResponse>> {
    return this.http
      .get<ResponseModel<RoleResponse>>(
        `${this.apiUrl}Role/GetBy-Id?roleId=${roleId}`
      )
      .pipe(
        tap(res => {
          if (res?.result?.rolePagePermissions) {
            const tree = this.buildMenuTree(res.result.rolePagePermissions);
            this.setMenu(tree);
          }
        })
      );
  }

  private buildMenuTree(permissions: RolePagePermission[]): MenuItem[] {
    const pages: MenuItem[] = permissions
      .filter(p =>
        p.isView &&
        p.page &&
        p.page.isActive &&
        !p.page.isDeleted &&
        !p.page.isHidden
      )
      .map(p => ({
        ...p.page,
        children: []
      }));
    const pageMap = new Map<number, MenuItem>();
    pages.forEach(page => {
      pageMap.set(page.id, page);
    });
    const tree: MenuItem[] = [];
    pages.forEach(page => {
      if (page.parentId && pageMap.has(page.parentId)) {
        pageMap.get(page.parentId)!.children.push(page);
      } else {
        tree.push(page);
      }
    });
    return this.sortMenu(tree);
  }

  private sortMenu(items: MenuItem[]): MenuItem[] {
    return items
      .sort((a, b) => (a.seriolNumber ?? 9999) - (b.seriolNumber ?? 9999))
      .map(item => ({
        ...item,
        children: item.children?.length
          ? this.sortMenu(item.children)
          : []
      }));

  }

  setMenu(menu: MenuItem[]): void {
    this.menuSubject.next(menu);
    localStorage.setItem(this.menuKey, JSON.stringify(menu));
  }

  getMenu(): MenuItem[] {
    return this.menuSubject.value;
  }

  clearMenu(): void {
    this.menuSubject.next([]);
    localStorage.removeItem(this.menuKey);
  }

  private loadFromStorage(): MenuItem[] {
    const menu = localStorage.getItem(this.menuKey);
    if (!menu) {
      return [];
    }
    try {
      const parsed = JSON.parse(menu) as MenuItem[];
      return this.sortMenu(parsed);
    } catch {
      return [];
    }
  }
}
