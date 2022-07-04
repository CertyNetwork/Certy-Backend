import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { StringField } from "decorators";

export class UploadDocumentDto {
  @StringField({ swagger: true, required: false })
  @IsOptional()
  documentType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata: any;
}