import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { ApplicationModule } from './modules/application/application.module';
import { ProjectModule } from './modules/project/project.module';
import { ComponentCategoryModule } from './modules/component-category/component-category.module';
import { ComponentModule } from './modules/component/component.module';
import { PageModule } from './modules/page/page.module';
import { IndustryModule } from './modules/industry/industry.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    UploadModule,
    ApplicationModule,
    ProjectModule,
    ComponentCategoryModule,
    ComponentModule,
    PageModule,
    IndustryModule
  ],
})
export class AppModule {}
