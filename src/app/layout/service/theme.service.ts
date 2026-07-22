import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

private themeKey = 'appTheme';
  private themeSubject = new BehaviorSubject<Theme>(this.loadTheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  toggleTheme(): void {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(this.themeKey, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }

  private loadTheme(): Theme {
    const stored = localStorage.getItem(this.themeKey) as Theme | null;
    return stored === 'dark' ? 'dark' : 'light';
  }
}
