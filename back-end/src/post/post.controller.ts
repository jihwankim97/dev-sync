import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './post.service';
import { GetPostsByCategoryDto } from './dto/category/get-posts-by-category.dto';
import { GetPostsByUserIdDto } from './dto/post/get-posts-by-user-id.dto';
import { UserService } from 'src/user/user.service';
import { CreatePostDto } from './dto/post/create-post.dto';
import { UpdatePostDto } from './dto/post/update-post.dto';
import { AddCommentDto } from './dto/comment/add-comment.dto';
import { UpdateCommentDto } from './dto/comment/update-comment.dto';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetSearchPostsDto } from './dto/post/get-search-post.dto';

@Controller('post')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UserService,
  ) {}

  //모든 카테고리 조회
  @Get('/categories')
  async getCateGories() {
    return await this.postsService.getCategories();
  }

  // 모든 게시글 조회
  @Get()
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  // 카테고리 이름으로 게시글 조회
  @Get('/categories/:category')
  async getPostsByCategory(@Param() params: GetPostsByCategoryDto) {
    return await this.postsService.getPostsByCategory(params);
  }

  // 유저 이메일로 게시글 조회
  @Get('/users/:email')
  async getPostsByUserId(@Param() params: GetPostsByUserIdDto) {
    const user = await this.userService.getUser(params.email);
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
    return await this.postsService.getPostsByUserId(user.id);
  }

  // 조회수 상위 n개 게시글 조회
  @Get('/top')
  async getTopPosts(@Query('n', ParseIntPipe) n: number) {
    return await this.postsService.getTopPosts(n);
  }

  //검색어로 게시글 조회
  @Get('search')
  async searchPosts(@Query() dto: GetSearchPostsDto) {
    const { keyword, category, type } = dto;
    return this.postsService.searchPosts(keyword, category, type);
  }

  @Post('/upload')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }])) // 여러 개 파일 업로드 가능
  async uploadPostFiles(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Request() req,
  ) {
    try {
      const user = req.user;
      // 게시글 생성 및 파일 업로드
      const result = await this.postsService.uploadPostFiles(
        user.id,
        files.files || [],
      );

      return {
        message: '파일이 성공적으로 업로드 되었습니다.',
        postId: result.postId,
        fileUrls: result.fileUrls,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : '게시글 생성 실패',
      );
    }
  }

  // 게시글 생성
  @Post()
  @UseGuards(AuthenticatedGuard)
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
    const user = req.user;

    const { title, content, category, postId } = createPostDto;
    const category_data = await this.postsService.getCategoryByName(category);
    if (!category_data) {
      throw new NotFoundException(`카테고리 '${name}'을(를) 찾을 수 없습니다.`);
    }

    try {
      return await this.postsService.createPost(
        user.id,
        postId,
        title,
        content,
        category,
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  // 게시글 삭제
  @Delete('/:id')
  @UseGuards(AuthenticatedGuard)
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.deletePost(id);
  }

  // 게시글 수정
  @Patch('/:id')
  @UseGuards(AuthenticatedGuard)
  async updatePost(
    @Param('id', ParseIntPipe) post_id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    const user = req.user;

    return await this.postsService.updatePost(user.id, post_id, updatePostDto);
  }

  // 게시글 조회수 증가
  @Patch('/:id/view')
  async increaseViewCount(@Param('id', ParseIntPipe) post_id: number) {
    return await this.postsService.increaseViewCount(post_id);
  }

  //특정 게시글의 좋아요 개수 조회
  @Get('/:id/likes/count')
  async getLikeCount(@Param('id', ParseIntPipe) post_id: number) {
    return await this.postsService.getLikeCount(post_id);
  }

  // 특정 게시글에서 현재 유저가 좋아요를 눌렀는지 확인
  @Get('/:id/likes/status')
  @UseGuards(AuthenticatedGuard)
  async getLikeStatus(
    @Param('id', ParseIntPipe) post_id: number,
    @Request() req,
  ) {
    const user = req.user;
    const like = await this.postsService.getLike(user.id, post_id);
    return like;
  }

  //좋아요 추가/취소 (토글 기능)
  @Post('/:id/like-toggle')
  @UseGuards(AuthenticatedGuard)
  async toggleLike(@Param('id', ParseIntPipe) post_id: number, @Request() req) {
    const user = req.user;

    return await this.postsService.toggleLike(user.id, post_id);
  }

  // 특정 게시글의 댓글 조회
  @Get('/comment/:id')
  async getComments(
    @Param('id') post_id: number,
    @Query('page') page: number = 1, // 기본값 1
  ) {
    const comments = await this.postsService.getComment(post_id, page);
    const totalCount = await this.postsService.getCommentCount(post_id);

    return { totalCount, comments };
  }

  // 댓글 생성
  @Post('/comment/:id')
  @UseGuards(AuthenticatedGuard)
  async addComment(
    @Param('id') post_id: number,
    @Body() addCommentDto: AddCommentDto,
    @Request() req,
  ) {
    const user = req.user;

    const { parentId, comment } = addCommentDto;

    return await this.postsService.addComment(
      user.id,
      post_id,
      parentId,
      comment,
    );
  }

  // 댓글 수정
  @Patch('/comment/:id')
  @UseGuards(AuthenticatedGuard)
  async updateComment(
    @Param('id') comment_id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    const user = req.user;

    const { comment } = updateCommentDto;
    return await this.postsService.updateComment(user.id, comment_id, comment);
  }

  // 댓글 삭제
  @Delete('/comment/:id')
  @UseGuards(AuthenticatedGuard)
  async deleteComment(
    @Param('id', ParseIntPipe) comment_id: number,
    @Request() req,
  ) {
    const user = req.user;

    return await this.postsService.deleteComment(user.id, comment_id);
  }
}
