import { IsNotEmpty, IsString, IsMongoId, Length, Matches, IsNumber } from 'class-validator';

export class CreateCardLinkDto {
  @IsNotEmpty()
  @IsMongoId()
  walletId: string;

  @IsNotEmpty()
  @IsString()
  cardNumber: string;

  @IsNotEmpty()
  @IsString()
  cardHolderName: string;

  @IsNotEmpty()
  @IsNumber()
  cvv: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: 'Expiry date must be in MM/YY format' })
  expiryDate: string;
}
