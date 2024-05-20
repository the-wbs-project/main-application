import { Injectable } from '@angular/core';
import { RESOURCE_TYPES } from '@wbs/core/models';
import { RecordResourceViewModel } from '@wbs/core/view-models';

@Injectable()
export class RecordResourceValidation {
  validate(vm: RecordResourceViewModel): boolean {
    vm.errors = {
      started: true,
    };

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
    if (vm.type === RESOURCE_TYPES.PDF || vm.type === RESOURCE_TYPES.IMAGE) {
      this.validateFile(vm);

      return (
        !vm.errors.nameRequired &&
        !vm.errors.descriptionRequired &&
        !vm.errors.fileRequired
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

  validateFile(vm: RecordResourceViewModel): void {
    vm.errors.fileRequired = vm.file == undefined;
  }
}
