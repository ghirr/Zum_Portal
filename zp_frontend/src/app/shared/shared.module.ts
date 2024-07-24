import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import {
  BsDatepickerModule,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxEditorModule } from 'ngx-editor';
import { NgxMaskModule } from 'ngx-mask';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ClipboardModule } from 'ngx-clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ToastrModule } from 'ngx-toastr';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LightboxModule } from 'ngx-lightbox';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastsModule } from '../feature-module/toasts/toasts.module';
import { NgChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    BsDatepickerModule.forRoot(),
    MatSelectModule,
    TimepickerModule.forRoot(),
    AngularEditorModule,
    MatTooltipModule,
    NgxMaskModule,
    NgxEditorModule,
    NgScrollbarModule,
    ClipboardModule,
    DragDropModule,
    ScrollingModule,
    ToastrModule,
    MatStepperModule,
    MatProgressBarModule,
    LightboxModule,
    TooltipModule.forRoot(),
    ToastsModule,
    NgChartsModule.forRoot(),
    NgApexchartsModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    BsDatepickerModule,
    MatSelectModule,
    TimepickerModule,
    AngularEditorModule,
    NgxMaskModule,
    NgxEditorModule,
    NgScrollbarModule,
    ClipboardModule,
    DragDropModule,
    ScrollingModule,
    ToastrModule,
    MatStepperModule,
    MatProgressBarModule,
    LightboxModule,
    TooltipModule,
    ToastsModule,
    NgChartsModule,
    NgApexchartsModule
  ],

  providers: [BsDatepickerConfig],
})
export class SharedModule {}
