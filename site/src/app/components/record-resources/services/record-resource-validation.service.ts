import { Injectable } from '@angular/core';
import { RESOURCE_TYPES } from '@wbs/core/models';
import { RecordResourceErrors, RecordResourceViewModel } from '../view-models';

@Injectable()
export class RecordResourceValidation {
  validate(vm: RecordResourceViewModel | undefined): RecordResourceErrors {
    if (!vm)
      return {
        started: false,
        valid: false,
      };

    const errors: RecordResourceErrors = {
      started: true,
      valid: false,
    };

    errors.nameRequired = this.validateName(vm);

    if (vm.type === RESOURCE_TYPES.LINK) {
      errors.urlRequired = this.validateUrl(vm);
      errors.valid = !errors.nameRequired && !errors.urlRequired;

      return errors;
    }
    if (
      vm.type === RESOURCE_TYPES.PDF ||
      (vm.type === RESOURCE_TYPES.IMAGE && vm.id == undefined)
    ) {
      errors.fileRequired = this.validateFile(vm);
      errors.valid = !errors.nameRequired && !errors.fileRequired;
    }

    return errors;
  }

  validateName(vm: RecordResourceViewModel): boolean {
    return vm.name.trim() === '';
  }

  validateUrl(vm: RecordResourceViewModel): boolean {
    return (vm.url?.trim() ?? '') === '';
  }

  validateFile(vm: RecordResourceViewModel): boolean {
    return vm.file == undefined;
  }
}
