import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/service/auth.service';
import { MenuItem } from '../../interface/menu-item';
import { MenuService } from '../../service/menu.service';
import { Theme, ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  menu$: Observable<MenuItem[]>;
  theme$: Observable<Theme>;
  user: any;

  private iconMap: Record<string, string> = {
    dashboard: 'bi-speedometer2',
    people: 'bi-people',
    schedule: 'bi-calendar3',
    event: 'bi-calendar-event',
    event_available: 'bi-calendar-check',
    payments: 'bi-credit-card',
    payment: 'bi-credit-card-2-front',
    person_add: 'bi-person-plus',
    trending_up: 'bi-graph-up-arrow',
    school: 'bi-mortarboard',
    assessment: 'bi-bar-chart',
    settings: 'bi-gear',
    person: 'bi-person',
    apartment: 'bi-building',
    work: 'bi-briefcase',
    folder: 'bi-folder',
    fingerprint: 'bi-fingerprint',
    report: 'bi-file-earmark-text',
    money: 'bi-cash-stack',
    receipt: 'bi-receipt',
    group: 'bi-people-fill',
    mic: 'bi-mic',
    user: 'bi-person-badge',
    role: 'bi-shield-lock',
    lock: 'bi-lock',
    chart: 'bi-bar-chart-line',
    check: 'bi-check-circle'
  };

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private themeService: ThemeService,
  ) {
    this.menu$ = this.menuService.menu$;
    this.theme$ = this.themeService.theme$;
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    const roleId = this.authService.getRoleId();

    if (roleId && this.menuService.getMenu().length === 0) {
      this.menuService.getRoleMenu(roleId).subscribe({
        error: (err) => console.error('Menu load failed', err)
      });
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/avatar-placeholder.png';
  }

  getIcon(icon: string): string {
    return this.iconMap[icon] ?? 'bi-dot';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }

}
