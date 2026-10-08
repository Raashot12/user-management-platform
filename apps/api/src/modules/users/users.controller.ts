import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { UserAcademicsDto, UserAddressDto, UserContactDto, UserInfoDto } from "./dto/create-user.dto";
import { PaginationQueryDto } from "./dto/pagination-query.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PaginatedUsersResponseDto, UserResponseDto } from "./dto/user-response.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: "Create a user's profile information" })
  @ApiBody({ type: UserInfoDto })
  @ApiCreatedResponse({ type: UserResponseDto, description: "Profile created. Use the returned id to add contact, address, and academic records." })
  create(@Body() dto: UserInfoDto) {
    return this.usersService.createUserInfo(dto);
  }

  @Post(":id/contact")
  @ApiOperation({ summary: "Add contact information to a user" })
  @ApiParam({ name: "id", description: "User profile UUID", format: "uuid" })
  @ApiBody({ type: UserContactDto })
  @ApiCreatedResponse({ type: UserResponseDto, description: "Contact information created" })
  addContact(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UserContactDto) {
    return this.usersService.addContact(id, dto);
  }

  @Post(":id/address")
  @ApiOperation({ summary: "Add an address to a user" })
  @ApiParam({ name: "id", description: "User profile UUID", format: "uuid" })
  @ApiBody({ type: UserAddressDto })
  @ApiCreatedResponse({ type: UserResponseDto, description: "Address created" })
  addAddress(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UserAddressDto) {
    return this.usersService.addAddress(id, dto);
  }

  @Post(":id/academics")
  @ApiOperation({ summary: "Add one or more schools to a user's academic history" })
  @ApiParam({ name: "id", description: "User profile UUID", format: "uuid" })
  @ApiBody({ type: UserAcademicsDto })
  @ApiCreatedResponse({ type: UserResponseDto, description: "Academic records created" })
  addAcademics(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UserAcademicsDto) {
    return this.usersService.addAcademics(id, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get a page of users with their related information" })
  @ApiOkResponse({ type: PaginatedUsersResponseDto })
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query.pageNumber, query.pageSize);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get one user with all related information" })
  @ApiParam({ name: "id", description: "User profile UUID", format: "uuid" })
  @ApiOkResponse({ type: UserResponseDto })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update one or more sections of a user record" })
  @ApiParam({ name: "id", description: "User profile UUID", format: "uuid" })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserResponseDto })
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a user and their related records" })
  @ApiParam({ name: "id", description: "User profile UUID", format: "uuid" })
  @ApiOkResponse({ schema: { type: "object", properties: { deleted: { type: "boolean" }, id: { type: "string", format: "uuid" } } } })
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
