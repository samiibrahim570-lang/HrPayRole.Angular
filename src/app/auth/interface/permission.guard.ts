import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
export const permissionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  let permissions = authService.getPermissions();

  if (!permissions || permissions.length === 0) {
    const localData = localStorage.getItem('userMenuPermissions');
    if (localData) {
      permissions = JSON.parse(localData);
      authService.initializePermissions(permissions);
    }
  }
  const currentUrl = state.url.toLowerCase();

  const hasViewPermission = permissions.some(perm =>
    perm.children?.some((child: any) => {
      const childLink = (child.link || '').toLowerCase();
      return currentUrl.includes(childLink) && child.isView === true;
    })
  );

  const hasAddPermission = permissions.some(perm =>
    perm.children?.some((child: any) => {
      const childLink = (child.link || '').toLowerCase();
      return currentUrl.includes(childLink) && child.isAdd === true;
    })
  );

  const hasEditPermission = permissions.some(perm =>
    perm.children?.some((child: any) => {
      const childLink = (child.link || '').toLowerCase();
      return currentUrl.includes(childLink) && child.isEdit === true;
    })
  );

  const hasDeletePermission = permissions.some(perm =>
    perm.children?.some((child: any) => {
      const childLink = (child.link || '').toLowerCase();
      return currentUrl.includes(childLink) && child.isDelete === true;
    })
  );

  if (!hasViewPermission && !hasAddPermission && !hasEditPermission && !hasDeletePermission) {
    router.navigate(['/no-access']);
    return false;
  }

  return true;
};
// export const permissionGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const authService = inject(AuthService);

//   let permissions = authService.getPermissions();

//   if (!permissions || permissions.length === 0) {
//     const localData = localStorage.getItem('userMenuPermissions');
//     if (localData) {
//       permissions = JSON.parse(localData);
//       authService.initializePermissions(permissions);
//     }
//   }

//   const currentUrl = state.url;

//   let hasViewPermission = false;

//   permissions?.forEach((perm: any) => {
//     perm.children?.forEach((child: any) => {
//       const childLink = child.link || '';
//       if (currentUrl === childLink && child.isView) {
//         hasViewPermission = true;
//       }
//     });
//   });

//   if (!hasViewPermission) {
//     console.warn('⛔ No View Permission - Redirecting');
//     router.navigate(['/no-access']);
//     return false;
//   }
//   return true;
// };
