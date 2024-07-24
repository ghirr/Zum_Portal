import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppsRoutingModule } from './apps-routing.module';

import { AppsComponent } from './apps.component';
import { CalendarComponent } from './calendar/calendar.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilePondModule } from 'ngx-filepond';

@NgModule({
  declarations: [
    AppsComponent,
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    AppsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FilePondModule,
    FullCalendarModule,
    SharedModule,
  ],
  providers: [
    DatePipe 
  ]
})
export class AppsModule {}
