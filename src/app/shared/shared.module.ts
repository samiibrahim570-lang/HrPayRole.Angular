
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedRoutingModule } from './shared-routing.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzIconModule } from 'ng-zorro-antd/icon';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { FormsModule } from '@angular/forms';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzTabsModule } from 'ng-zorro-antd/tabs';import { IconModule } from '@ant-design/icons-angular';
import { NzNotificationModule } from 'ng-zorro-antd/notification';import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    NzTabsModule,
    NzRateModule,
    SharedRoutingModule,
    NzSelectModule,
    NzSpaceModule,
    NzDescriptionsModule,
    NzIconModule,
    NzCardModule,
    NzGridModule,
    NzTreeSelectModule,
    NzPaginationModule,
    NzTableModule,
    NzTagModule,
    NzFormModule,
    NzMessageModule,
    NzCheckboxModule,
    NzSwitchModule,
    NzModalModule,
    NzButtonModule,
    NzPopoverModule,
    NzInputNumberModule,
    NzInputModule,
    NzDatePickerModule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzEmptyModule,
    NzUploadModule,
    NzDrawerModule,
    NzDividerModule,
    NzDropDownModule,
    NzAlertModule,
    NzRadioModule,
    NzAvatarModule,
    NzCollapseModule,
    NzTreeModule,
    NzBadgeModule,
    NzTreeViewModule,
    NzStepsModule,
    NzSliderModule,
    NzBackTopModule,
    NzToolTipModule,
    NzBreadCrumbModule,
    NzCalendarModule,
    NzTimePickerModule,
    NzAutocompleteModule,
    NzCarouselModule,
    NzProgressModule,
    NzImageModule,
    NzStatisticModule,
    NzSpinModule,
    NzResultModule,
    NzTabsModule,
    NzCommentModule,
    FormsModule,
    NzListModule,
    NzSegmentedModule,
    NzTabsModule,
    NzDropDownModule,
    NzNotificationModule,
    NzSkeletonModule,
    NzTypographyModule
  ],
  exports: [
    NzSelectModule,
    NzDropDownModule,
    NzRateModule,
    NzSpaceModule,
    NzDescriptionsModule,
    NzIconModule,
    NzCardModule,
    NzGridModule,
    NzTabsModule,
    NzTreeSelectModule,
    NzPaginationModule,
    NzTableModule,
    NzTabsModule,
    NzTagModule,
    NzFormModule,
    NzMessageModule,
    NzCheckboxModule,
    NzSwitchModule,
    NzModalModule,
    NzButtonModule,
    NzPopoverModule,
    NzInputNumberModule,
    NzInputModule,
    NzDatePickerModule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzEmptyModule,
    NzUploadModule,
    NzDrawerModule,
    NzDividerModule,
    NzDropDownModule,
    NzAlertModule,
    NzRadioModule,
    NzAvatarModule,
    NzCollapseModule,
    NzTreeModule,
    NzBadgeModule,
    NzTreeViewModule,
    NzStepsModule,
    NzSliderModule,
    NzBackTopModule,
    NzToolTipModule,
    NzBreadCrumbModule,
    NzCalendarModule,
    NzTimePickerModule,
    NzAutocompleteModule,
    DragDropModule,
    NzCarouselModule,
    NzProgressModule,
    NzImageModule,
    NzStatisticModule,
    NzSpinModule,
    NzResultModule,
    NzCommentModule,
    FormsModule,
    NzListModule,
    NzSegmentedModule,
    NzTabsModule,
    IconModule,
    NzNotificationModule,
    NzSkeletonModule,
    NzTypographyModule
  ]
})
export class SharedModule { }
