import {
  Controller,
  Get,
  Post,
  Put,
  Request,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Param,
  Query,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { UserService } from 'src/user/user.service';
import { ResumeGenerationService } from './resumeGeneration.Service';
import { SkillSeederService } from './skill_seeder.service';
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

@Controller('resumes')
export class ResumeController {
  constructor(
    private readonly userService: UserService,
    private readonly resumeService: ResumeService,
    private readonly resumeGenerationService: ResumeGenerationService,
    private readonly skillSeederService: SkillSeederService,
  ) {}

  // 자소서 생성 엔드포인트
  @Post('generate')
  @UseGuards(AuthenticatedGuard)
  async generateResume(
    @Request() req,
    @Body('profileData') profileData: string,
  ) {
    try {
      // 입력 데이터 길이를 최대 4000자로 제한
      const limitedProfileData = profileData.slice(0, 4000);

      const user = req.user;

      const resume = await this.resumeGenerationService.generateResume(
        limitedProfileData,
        user.id,
      );
      return resume;
    } catch (err) {
      console.error('Error generating resume:', err);
      throw new HttpException(
        'Failed to generate resume',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 사용자 레포지토리 정보 가져오기 엔드포인트
  @Get('github/repos')
  @UseGuards(AuthenticatedGuard)
  async getAuthStatus(@Request() req) {
    if (req.isAuthenticated()) {
      return await this.resumeService.getGitHubData(
        req.user.name,
        req.user.email,
      );
    } else {
      return 'Not authenticated';
    }
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  async getAllResumes(@Request() req) {
    return this.resumeService.getResumes(req.user.id); // 전체 조회
  }

  @Get(':id')
  @UseGuards(AuthenticatedGuard)
  async getResume(@Param('id') id: string) {
    const resume = await this.resumeService.getResumeDetails(id);
    if (!resume) {
      throw new HttpException('Resume not found', HttpStatus.NOT_FOUND);
    }

    return resume;
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  async deleteResume(@Param('id') id: string, @Request() req) {
    const user = req.user;
    const resume = await this.resumeService.removeResume(user.id, id);
    if (!resume) {
      throw new HttpException('Resume not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Resume deleted successfully' };
  }

  @Post(':id/introductions')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(UpsertResumeEntityDtoFilter) 
  async createIntroduction(
    @Param('id') id: string,
    @Body() createIntroductionDto: CreateIntroductionDto,
  ) {
    return await this.resumeService.saveBlock(id, createIntroductionDto);
  }

  @Delete(':id/introductions')
  @UseGuards(AuthenticatedGuard)
  async removeIntroduction(@Param('id') id: string) {
    return this.resumeService.removeIntroduction(id);
  }

  @Post(':id/profiles')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(UpsertResumeEntityDtoFilter) 
  async createProfile(
    @Param('id') id: string,
    @Body() profileDto: CreateProfileDto,
  ) {
    return await this.resumeService.saveBlock(id, profileDto);
  }

  @Delete(':id/profiles')
  @UseGuards(AuthenticatedGuard)
  async removeProfile(@Param('id') id: string) {
    return this.resumeService.removeProfile(id);
  }

  @Post(':id/projects')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(UpsertResumeEntityDtoFilter) 
  async createProject(
    @Param('id') id: string,
    @Body() createProjectsDto: CreateProjectsWidthOutcomesDto,
  ) {
    return await this.resumeService.saveBlock(id, createProjectsDto);
  }

  @Delete(':id/projects')
  @UseGuards(AuthenticatedGuard)
  async removeProject(@Param('id') id: string) {
    return this.resumeService.removeProject(id);
  }

  @Post(':id/skills')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(UpsertResumeEntityDtoFilter) 
  async createSkills(
    @Param('id') id: string,
    @Body() createSkillsDto: CreateSkillsDto,
  ) {
    return await this.resumeService.saveBlock(id, createSkillsDto);
  }

  @Delete(':resumeId/skills')
  async removeSkills(@Param('resumeId') resumeId: string) {
    return this.resumeService.removeSkills(resumeId);
  }

  @Get('skills/search')
  @UseGuards(AuthenticatedGuard)
  async searchSkills(@Query('query') query: string) {
    return this.resumeService.searchSkills(query);
  }

  @Post(':id/achievements')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(UpsertResumeEntityDtoFilter) 
  async createAchievements(
    @Param('id') id: string,
    @Body() createAchievementsDto: CreateAchievementsDto,
  ) {
    return await this.resumeService.saveBlock(id, createAchievementsDto);
  }

  @Delete(':id/achievements')
  @UseGuards(AuthenticatedGuard)
  async removeAchievement(@Param('id') id: string) {
    return this.resumeService.removeAchievement(id);
  }

  @Post(':id/careers')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(UpsertResumeEntityDtoFilter) 
  async createCareers(
    @Param('id') id: string,
    @Body() createCareersDto: CreateCareersDto,
  ) {
    return await this.resumeService.saveBlock(id, createCareersDto);
  }

  @Delete(':id/careers')
  @UseGuards(AuthenticatedGuard)
  async removeCareer(@Param('id') id: string) {
    return this.resumeService.removeCareer(id);
  }

  @Post(':id/customs')
  @UseGuards(AuthenticatedGuard)
  @UseFilters(UpsertResumeEntityDtoFilter) 
  async createCustom(
    @Param('id') id: string,
    @Body() createCustomDto: CreateCustomDto,
  ) {
    return await this.resumeService.saveBlock(id, createCustomDto);
  }

  @Delete(':id/customs/:customId')
  @UseGuards(AuthenticatedGuard)
  async removeCustom(
    @Param('id') id: string,
    @Param('customId') customId: string,
  ) {
    return this.resumeService.removeCustom(id, customId);
  }

  @Put(':id/orders')
  @UseGuards(AuthenticatedGuard)
  async updateBlockOrders(
    @Param('id') id: string,
    @Body() updateBlockOrdersDto: UpdateBlockOrdersDto,
  ) {
    return this.resumeService.updateBlockOrders(id, updateBlockOrdersDto);
  }

  @Get(':id/orders')
  @UseGuards(AuthenticatedGuard)
  async getBlockOrders(@Param('id') id: string) {
    return this.resumeService.getBlockOrders(id);
  }
}
