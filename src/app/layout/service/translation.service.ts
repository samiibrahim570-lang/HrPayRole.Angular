import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'en' | 'ur';

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  en: {
    search_placeholder: 'Search employees, documents...',
    logout: 'Logout',
    menu_title: 'Menu',
    brand_name: 'Invoice Management',
    brand_tagline: 'Enterprise Suite',
    'Dashboard': 'Dashboard',
    'Employee Management': 'Employee Management',
    'Employees': 'Employees',
    'Departments': 'Departments',
    'Designations': 'Designations',
    'Employee Documents': 'Employee Documents',
    'Attendance Management': 'Attendance Management',
    'Attendance Entry': 'Attendance Entry',
    'Attendance Report': 'Attendance Report',
    'Leave Management': 'Leave Management',
    'Leave Types': 'Leave Types',
    'Leave Request': 'Leave Request',
    'Leave Approval': 'Leave Approval',
    'Payroll Management': 'Payroll Management',
    'Salary Setup': 'Salary Setup',
    'Payroll Process': 'Payroll Process',
    'Salary Slip': 'Salary Slip',
    'Recruitment': 'Recruitment',
    'Candidates': 'Candidates',
    'Interviews': 'Interviews',
    'Performance Management': 'Performance Management',
    'Training Management': 'Training Management',
    'Reports': 'Reports',
    'Employee Report': 'Employee Report',
    'Payroll Report': 'Payroll Report',
    'Administration': 'Administration',
    'Users': 'Users',
    'Roles': 'Roles',
    'Page Permission': 'Page Permission'
  },
  ur: {
    search_placeholder: 'ملازمین، دستاویزات تلاش کریں...',
    logout: 'لاگ آؤٹ',
    menu_title: 'مینیو',
    brand_name: 'انوائس مینجمنٹ',
    brand_tagline: 'انٹرپرائز سویٹ',
    'Dashboard': 'ڈیش بورڈ',
    'Employee Management': 'ملازمین کا انتظام',
    'Employees': 'ملازمین',
    'Departments': 'شعبہ جات',
    'Designations': 'عہدے',
    'Employee Documents': 'ملازم دستاویزات',
    'Attendance Management': 'حاضری کا انتظام',
    'Attendance Entry': 'حاضری اندراج',
    'Attendance Report': 'حاضری رپورٹ',
    'Leave Management': 'رخصت کا انتظام',
    'Leave Types': 'رخصت کی اقسام',
    'Leave Request': 'رخصت کی درخواست',
    'Leave Approval': 'رخصت کی منظوری',
    'Payroll Management': 'تنخواہ کا انتظام',
    'Salary Setup': 'تنخواہ ترتیب',
    'Payroll Process': 'تنخواہ کارروائی',
    'Salary Slip': 'تنخواہ پرچی',
    'Recruitment': 'بھرتی',
    'Candidates': 'امیدوار',
    'Interviews': 'انٹرویوز',
    'Performance Management': 'کارکردگی کا انتظام',
    'Training Management': 'تربیت کا انتظام',
    'Reports': 'رپورٹس',
    'Employee Report': 'ملازم رپورٹ',
    'Payroll Report': 'تنخواہ رپورٹ',
    'Administration': 'انتظامیہ',
    'Users': 'صارفین',
    'Roles': 'کردار',
    'Page Permission': 'صفحہ اجازت'
  }
};


@Injectable({
  providedIn: 'root'
})
export class TranslationService {

private langKey = 'appLang';
  private langSubject = new BehaviorSubject<Lang>(this.loadLang());
  lang$ = this.langSubject.asObservable();

  constructor() {
    this.applyDirection(this.langSubject.value);
  }

  get currentLang(): Lang {
    return this.langSubject.value;
  }

  toggleLang(): void {
    this.setLang(this.currentLang === 'en' ? 'ur' : 'en');
  }

  setLang(lang: Lang): void {
    localStorage.setItem(this.langKey, lang);
    this.langSubject.next(lang);
    this.applyDirection(lang);
  }

  translate(key: string): string {
    return TRANSLATIONS[this.currentLang][key] ?? key;
  }

  private applyDirection(lang: Lang): void {
    document.documentElement.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }

  private loadLang(): Lang {
    const stored = localStorage.getItem(this.langKey) as Lang | null;
    return stored === 'ur' ? 'ur' : 'en';
  }
}
