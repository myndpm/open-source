import { TemplateRef } from '@angular/core';

/**
 * Used to communicate templates with its parameters to the Wrappers
 */
export interface DynTemplate {
  template: TemplateRef<any>;
  params: Record<string, any>;
}

/**
 * A custom Map of template+params grouped by different sections (id) like prefix, suffix.
 */
export class DynTemplates extends Map<string, DynTemplate[]> {
  add(id: string, template: TemplateRef<any>, params: Record<string, any>): void {
    if (!this.has(id)) {
      this.set(id, []);
    }
    this.get(id).push({ template, params });
  }

  override get(id: string): DynTemplate[] {
    return super.get(id) ?? [];
  }
}
