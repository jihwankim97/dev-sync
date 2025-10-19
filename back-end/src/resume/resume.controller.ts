import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Param,
  Query,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeGenerationService } from './resumeGeneration.Service';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { CreateIntroductionDto } from './dto/create-introduction.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { CreateProjectsWidthOutcomesDto } from './dto/create-projects-width-outcomes.dto';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { CreateAchievementsDto } from './dto/create-achievements.dto';
import { CreateCustomDto } from './dto/create-custom.dto';
import { CreateCareersDto } from './dto/create-careers.dto';
import { UpdateBlockOrdersDto } from './dto/update-block-orders.dto';
import { UpsertResumeEntityDtoFilter } from './filter/upsert-resume-entity-dto.filter';
import { User } from 'src/user/decorator/user.decorator';
import { User as UserEntity } from 'src/user/entity/user.entity';
import { githubRepoService } from './github-repo.service';
import { ResumeOwnershipGuard } from './guard/resume-ownership.guard';

@Controller('resumes')
@UseGuards(AuthenticatedGuard)
export class ResumeController {
  constructor(
    private readonly resumeService: ResumeService,
    private readonly resumeGenerationService: ResumeGenerationService,
    private readonly githubRepoService: githubRepoService,
  ) {}

  @Post('generate')
  async generateResume(
    @User() user: UserEntity,
    @Body('profileData') profileData: string,
  ) {
    return this.resumeGenerationService.generateResume(profileData, user);
  }

  @Get('skills/search')
  async searchSkills(@Query('query') query: string) {
    return this.resumeService.searchSkills(query);
  }

  @Get('github-repos')
  async getGitHubRepos(@User() user: UserEntity) {
    return this.githubRepoService.getGitHubData(user.name, user.email);
  }

  @Get()
  async getAllResumes(@User() user: UserEntity) {
    return this.resumeService.findAll(user.id);
  }

  @Get(':id')
  @UseGuards(ResumeOwnershipGuard)
  async getResume(@Param('id') id: string) {
    return this.resumeService.findDetail(id);
  }

  @Delete(':id')
  @UseGuards(ResumeOwnershipGuard)
  async deleteResume(@Param('id') id: string) {
    return this.resumeService.remove(id);
  }

  @Post(':id/introductions')
  @UseFilters(UpsertResumeEntityDtoFilter)
  @UseGuards(ResumeOwnershipGuard)
  async createIntroduction(
    @Param('id') id: string,
    @Body() createIntroductionDto: CreateIntroductionDto,
  ) {
    return this.resumeService.saveBlock(id, createIntroductionDto);
  }

  @Delete(':id/introductions')
  @UseGuards(ResumeOwnershipGuard)
  async removeIntroduction(@Param('id') id: string) {
    return this.resumeService.removeIntroduction(id);
  }

  @Post(':id/profiles')
  @UseFilters(UpsertResumeEntityDtoFilter)
  @UseGuards(ResumeOwnershipGuard)
  async createProfile(
    @Param('id') id: string,
    @Body() profileDto: CreateProfileDto,
  ) {
    return this.resumeService.saveBlock(id, profileDto);
  }

  @Delete(':id/profiles')
  @UseGuards(ResumeOwnershipGuard)
  async removeProfile(@Param('id') id: string) {
    return this.resumeService.removeProfile(id);
  }

  @Post(':id/projects')
  @UseFilters(UpsertResumeEntityDtoFilter)
  @UseGuards(ResumeOwnershipGuard)
  async createProject(
    @Param('id') id: string,
    @Body() createProjectsDto: CreateProjectsWidthOutcomesDto,
  ) {
    return this.resumeService.saveBlock(id, createProjectsDto);
  }

  @Delete(':id/projects')
  @UseGuards(ResumeOwnershipGuard)
  async removeProject(@Param('id') id: string) {
    return this.resumeService.removeProject(id);
  }

  @Post(':id/skills')
  @UseFilters(UpsertResumeEntityDtoFilter)
  @UseGuards(ResumeOwnershipGuard)
  async createSkills(
    @Param('id') id: string,
    @Body() createSkillsDto: CreateSkillsDto,
  ) {
    return this.resumeService.saveBlock(id, createSkillsDto);
  }

  @Delete(':id/skills')
  @UseGuards(ResumeOwnershipGuard)
  async removeSkills(@Param('id') id: string) {
    return this.resumeService.removeSkills(id);
  }

  @Post(':id/achievements')
  @UseFilters(UpsertResumeEntityDtoFilter)
  @UseGuards(ResumeOwnershipGuard)
  async createAchievements(
    @Param('id') id: string,
    @Body() createAchievementsDto: CreateAchievementsDto,
  ) {
    return this.resumeService.saveBlock(id, createAchievementsDto);
  }

  @Delete(':id/achievements')
  @UseGuards(ResumeOwnershipGuard)
  async removeAchievement(@Param('id') id: string) {
    return this.resumeService.removeAchievement(id);
  }

  @Post(':id/careers')
  @UseFilters(UpsertResumeEntityDtoFilter)
  @UseGuards(ResumeOwnershipGuard)
  async createCareers(
    @Param('id') id: string,
    @Body() createCareersDto: CreateCareersDto,
  ) {
    return this.resumeService.saveBlock(id, createCareersDto);
  }

  @Delete(':id/careers')
  @UseGuards(ResumeOwnershipGuard)
  async removeCareer(@Param('id') id: string) {
    return this.resumeService.removeCareer(id);
  }

  @Post(':id/customs')
  @UseFilters(UpsertResumeEntityDtoFilter)
  @UseGuards(ResumeOwnershipGuard)
  async createCustom(
    @Param('id') id: string,
    @Body() createCustomDto: CreateCustomDto,
  ) {
    return this.resumeService.saveBlock(id, createCustomDto);
  }

  @Delete(':id/customs/:customId')
  @UseGuards(ResumeOwnershipGuard)
  async removeCustom(
    @Param('id') id: string,
    @Param('customId') customId: string,
  ) {
    return this.resumeService.removeCustom(id, customId);
  }

  @Put(':id/orders')
  @UseGuards(ResumeOwnershipGuard)
  async updateBlockOrders(
    @Param('id') id: string,
    @Body() updateBlockOrdersDto: UpdateBlockOrdersDto,
  ) {
    return this.resumeService.updateBlockOrders(id, updateBlockOrdersDto);
  }

  @Get(':id/orders')
  @UseGuards(ResumeOwnershipGuard)
  async findBlockOrders(@Param('id') id: string) {
    return this.resumeService.findBlockOrders(id);
  }
}
