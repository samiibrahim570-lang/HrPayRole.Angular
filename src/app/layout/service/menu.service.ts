import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, Observable,  } from 'rxjs';
import { MenuItem, RolePagePermission, RoleResponse } from '../interface/menu-item';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from 'src/app/shared/interface/ResponsemodelArray';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl: string = environment.apiUrl;
  private menuKey: string = 'menuData';
  private menuSubject = new BehaviorSubject<MenuItem[]>(this.loadFromStorage());
  menu$ = this.menuSubject.asObservable();

  constructor(private http: HttpClient) {}

  getRoleMenu(roleId: number): Observable<ResponseModel<RoleResponse>> {
    return this.http
      .get<ResponseModel<RoleResponse>>(`${this.apiUrl}Role/GetBy-Id?roleId=${roleId}`)
      .pipe(
        tap((res) => {
          if (res?.result?.rolePagePermissions) {
            const tree = this.buildMenuTree(res.result.rolePagePermissions);
            this.setMenu(tree);
          }
        })
      );
  }

  private buildMenuTree(permissions: RolePagePermission[]): MenuItem[] {
    const pages: MenuItem[] = permissions
      .filter((p) => p.isView && p.page?.isActive && !p.page?.isDeleted && !p.page?.isHidden)
      .map((p) => ({ ...p.page, children: [] }))
      .sort((a, b) => a.seriolNumber - b.seriolNumber);

    const pageMap = new Map<number, MenuItem>();
    pages.forEach((page) => pageMap.set(page.id, page));

    const tree: MenuItem[] = [];

    pages.forEach((page) => {
      if (page.parentId && pageMap.has(page.parentId)) {
        pageMap.get(page.parentId)!.children.push(page);
      } else if (!page.parentId) {
        tree.push(page);
      }
    });

    return tree;
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
    if (menu) {
      try {
        return JSON.parse(menu) as MenuItem[];
      } catch {
        return [];
      }
    }
    return [];
  }
}
