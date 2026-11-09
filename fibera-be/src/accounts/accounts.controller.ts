import {
    Body,
    Controller,
    Param,
    ParseUUIDPipe,
    Patch,
} from '@nestjs/common';
import { Roles } from '../auth/auth.decorators.js';
import { Role } from '../common/constants/role.enum.js';
import { ResponseMessage } from '../common/decorators/response-message.decorator.js';
import { AccountsService } from './accounts.service.js';
import { UpdateAccountStatusDto } from './dto/update-acc-status.dto.js';

@Controller('accounts')
@Roles(Role.ADMIN)
export class AccountsController {
    constructor(private readonly accounts: AccountsService) { }

    @Patch(':id/status')
    @ResponseMessage('Account status updated')
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAccountStatusDto,
    ) {
        return this.accounts.updateStatus(id, dto.status);
    }
}