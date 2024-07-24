import { CanActivateFn } from '@angular/router';

export const adminOrTalentmanagementOrGeneralManagerOrProjectManagerGuard: CanActivateFn = (route, state) => {
  return true;
};
