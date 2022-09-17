import { DynControlConfig } from '../types/control.types';

export function isDynHidden(control: string | DynControlConfig): boolean {
  const id: string = typeof control !== 'string'
    ? control.control
    : control;
  return id === 'HIDDEN' || id === 'HIDDEN-GROUP';
}
