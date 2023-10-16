import { Injectable } from '@angular/core';
import { RecordResourceViewModel } from '../view-models';
import { RESOURCE_TYPES } from '@wbs/core/models';

@Injectable()
export class RecordResourceValidation {
  validate(vm: RecordResourceViewModel): boolean {
    vm.errors = {};

    this.validateName(vm);
    this.validateDescription(vm);

    if (vm.type === RESOURCE_TYPES.LINK) {
      this.validateUrl(vm);

      return (
        !vm.errors.nameRequired &&
        !vm.errors.descriptionRequired &&
        !vm.errors.urlRequired
      );
    }

    return !vm.errors.nameRequired && !vm.errors.descriptionRequired;
  }

  validateName(vm: RecordResourceViewModel): void {
    vm.errors.nameRequired = (vm.name?.trim() ?? '') === '';
  }

  validateDescription(vm: RecordResourceViewModel): void {
    vm.errors.descriptionRequired = (vm.description?.trim() ?? '') === '';
  }

  validateUrl(vm: RecordResourceViewModel): void {
    vm.errors.urlRequired = (vm.url?.trim() ?? '') === '';
  }
}
