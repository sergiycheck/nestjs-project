import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends ConsoleLogger {
  constructor(private configService: ConfigService) {
    super();
  }
  customLog(msg: any, ...rest: any[]) {
    this.log(msg, ...rest);
  }

  log(message: any, context?: string): void;
  log(message: any, ...optionalParams: any[]): void;
  log(message: any, context?: any, ...rest: any[]): void {
    const envType = this.configService.get('NODE_ENV') as string;
    if (envType === 'dev') {
      super.log(message, context, ...rest);
    }
  }
}
