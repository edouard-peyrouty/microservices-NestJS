import { BadRequestException } from '@nestjs/common';

export class CannotShipUnpaidOrderException extends BadRequestException {
  constructor() {
    super('Une commande ne peut pas être expédiée si elle n\'est pas payée');
  }
}