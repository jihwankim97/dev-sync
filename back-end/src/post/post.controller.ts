import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { GetPostsByCategoryDto } from './dto/category/get-posts-by-category.dto';
import { UserService } from 'src/user/user.service';
import { CreatePostDto } from './dto/post/create-post.dto';
import { UpdatePostDto } from './dto/post/update-post.dto';
import { AddCommentDto } from './dto/comment/add-comment.dto';
import { UpdateCommentDto } from './dto/comment/update-comment.dto';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { User } from 'src/user/decorator/user.decorator';
import { SearchPostDto } from './dto/post/search-post.dto';
import { PostOwnershipGuard } from './guard/post-ownership.guard';
import { User as UserEntity } from 'src/user/entity/user.entity';

@Controller('post')
export class PostsController {
  constructor(
    private readonly postsService: PostService,
    private readonly userService: UserService,
  ) {}

  //모든 카테고리 조회
  @Get('/categories')
  async getCateGories() {
    return this.postsService.findAllCategories();
  }

  // 모든 게시글 조회
  @Get()
  async getAllPosts() {
    return this.postsService.findAll();
  }

  // 카테고리 이름으로 게시글 조회
  @Get('/categories/:category')
  async getPostsByCategory(@Param() params: GetPostsByCategoryDto) {
    return this.postsService.findPostsByCategory(params);
  }

  // 유저 이메일로 게시글 조회
  @Get('/users/:email')
  async getPostsByUserId(@Param('email') email: string) {
    return this.postsService.findByUserEmail(email);
  }

  // 조회수 상위 n개 게시글 조회
  @Get('/top')
  async getTopPosts(@Query('n', ParseIntPipe) n: number) {
    return this.postsService.findTop(n);
  }

  //검색어로 게시글 조회
  @Get('search')
  async searchPosts(@Query() dto: SearchPostDto) {
    return this.postsService.search(dto);
  }

  // 게시글 파일 업로드
  @Post('/upload')
  @UseGuards(AuthenticatedGuard, PostOwnershipGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
  async uploadPostFiles(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @User() user: UserEntity,
  ) {
    return this.postsService.uploadPostFiles(user.id, files.files);
  }

  // 게시글 생성
  @Post()
  @UseGuards(AuthenticatedGuard, PostOwnershipGuard)
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  // 게시글 삭제
  @Delete('/:id')
  @UseGuards(AuthenticatedGuard, PostOwnershipGuard)
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }

  // 게시글 수정
  @Patch('/:id')
  @UseGuards(AuthenticatedGuard, PostOwnershipGuard)
  async updatePost(
    @Param('id', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(postId, updatePostDto);
  }

  // 게시글 조회수 증가
  @Patch('/:id/view')
  async increaseViewCount(@Param('id', ParseIntPipe) postId: number) {
    return this.postsService.increaseView(postId);
  }

  //특정 게시글의 좋아요 개수 조회
  @Get('/:id/likes/count')
  async getLikeCount(@Param('id', ParseIntPipe) postId: number) {
    return this.postsService.findLikeCount(postId);
  }

  // 특정 게시글에서 현재 유저가 좋아요를 눌렀는지 확인
  @Get('/:id/likes/status')
  @UseGuards(AuthenticatedGuard)
  async getLikeStatus(
    @Param('id', ParseIntPipe) postId: number,
    @User() user: UserEntity,
  ) {
    return this.postsService.findLike(user.id, postId);
  }

  //좋아요 추가/취소
  @Post('/:id/like-toggle')
  @UseGuards(AuthenticatedGuard)
  async toggleLike(
    @Param('id', ParseIntPipe) postId: number,
    @User() user: UserEntity,
  ) {
    return this.postsService.toggleLike(user, postId);
  }

  // 특정 게시글의 댓글 조회
  @Get('/comment/:id')
  async getComments(
    @Param('id', ParseIntPipe) postId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const comments = await this.postsService.findComments(postId, page);
    const totalCount = await this.postsService.findCommentCount(postId);
    return { totalCount, comments };
  }

  // 댓글 생성
  @Post('/comment/:id')
  @UseGuards(AuthenticatedGuard)
  async addComment(
    @Param('id', ParseIntPipe) postId: number,
    @Body() addCommentDto: AddCommentDto,
    @User() user: UserEntity,
  ) {
    return this.postsService.createComment(user.id, postId, addCommentDto);
  }

  // 댓글 수정
  @Patch('/comment/:id')
  @UseGuards(AuthenticatedGuard)
  async updateComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: UserEntity,
  ) {
    return this.postsService.updateComment(
      user.id,
      commentId,
      updateCommentDto,
    );
  }

  // 댓글 삭제
  @Delete('/comment/:id')
  @UseGuards(AuthenticatedGuard)
  async deleteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @User() user: UserEntity,
  ) {
    return this.postsService.removeComment(user.id, commentId);
  }
}
