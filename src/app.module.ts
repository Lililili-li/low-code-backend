import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module'
import { UploadModule } from './modules/upload/upload.module';
import { ApplicationModule } from './modules/application/application.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule, UploadModule, ApplicationModule],
})
export class AppModule { }
