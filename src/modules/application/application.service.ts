import { Injectable } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationService {

    constructor() {}

    createApplication(params: CreateApplicationDto) {
        
    }
}
