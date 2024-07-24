import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppsComponent } from './apps.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AuthServiceGuard } from 'src/app/core/core.index';

const routes: Routes = [
  { 
    path: '', 
    component: AppsComponent,
    children: [
      // { path: "chats", component: ChatsComponent },
      // { path: "contacts", component: ContactsComponent },

      { path: "calendar", component: CalendarComponent,canActivate:[AuthServiceGuard] },
      // { path: "file-manager", component: FileManagerComponent },
      // { path: "voice-call", component: VoiceCallComponent },
      // { path: "video-call", component: VideoCallComponent },
      // { path: "outgoing-call", component: OutgoingCallComponent },
      // { path: "incoming-call", component: IncomingCallComponent },
      // {
      //   path: 'email',
      //   component: EmailPagecontentComponent
      // },
      // {
      //   path: 'mailview',
      //   component: EmailEmailviewComponent
      // },
      // {
      //   path:'compose',
      //   component:EmailComposeComponent
      // },
    ] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule { }
