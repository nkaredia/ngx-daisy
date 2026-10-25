import { computed, Directive, inject } from '@angular/core';
import { injectDaisyUIClasses } from '@ngx-daisy/cdk/config';
import { DsyNativeControl } from '@ngx-daisy/cdk/form-field';
/** Angular validation owns bound controls; native validity is used only without a form binding. */
@Directive({
  selector: 'input[dsyValidator],select[dsyValidator],textarea[dsyValidator]',
  standalone: true,
  host: { '[class]': 'classes()' },
})
export class DsyValidator {
  private readonly control = inject(DsyNativeControl, { optional: true });
  private readonly daisy = injectDaisyUIClasses();
  protected readonly classes = computed(() =>
    this.control?.formState().bound ? '' : this.daisy('validator'),
  );
}
