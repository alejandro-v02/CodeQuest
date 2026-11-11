import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CLIENT_EVENT_NAMES, MAX_EVENTS_PER_BATCH } from '../analytics.rules';

export class TrackEventDto {
  @IsIn(CLIENT_EVENT_NAMES)
  name: (typeof CLIENT_EVENT_NAMES)[number];

  // Flat primitive values only; anything else is dropped by sanitizeProps.
  @IsOptional()
  @IsObject()
  props?: Record<string, unknown>;
}

export class TrackEventsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_EVENTS_PER_BATCH)
  @ValidateNested({ each: true })
  @Type(() => TrackEventDto)
  events: TrackEventDto[];
}
