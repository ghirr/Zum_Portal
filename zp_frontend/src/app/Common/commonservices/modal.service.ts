import { Injectable } from '@angular/core';
import {Modal} from 'bootstrap';


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  closeModel(element:any){
    const modalElement = document.getElementById(element);
  
    if (modalElement) {
      // Trigger the 'data-bs-dismiss="modal"' attribute
      const dismissTrigger = modalElement.querySelector('[data-bs-dismiss="modal"]');
      if (dismissTrigger) {
        (dismissTrigger as HTMLElement).click(); // Simulate a click on the trigger
      } else {
        // If no dismiss trigger is found, fallback to manually hiding the modal
        modalElement.classList.remove('show');
      }
      // Optionally dispatch a custom event to signal modal closure
      const hideEvent = new Event(element);
      modalElement.dispatchEvent(hideEvent);
  }
  
  
  }
  openModel(elementId: string) {
    const modalElement = document.getElementById(elementId);

    if (modalElement) {
      // Use Bootstrap's modal method to show the modal
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    // Get month and add 1 since getMonth() returns 0-indexed values
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
  }
  invertFormatDate(dateString: string): string {
    const parts = dateString.split('-'); // Sépare la chaîne en parties (année, mois, jour)
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    // Retourne la date au format 'DD/MM/YYYY'
    return `${day}/${month}/${year}`;
}

}
