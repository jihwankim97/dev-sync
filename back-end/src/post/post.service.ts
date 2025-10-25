import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Not, Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { GetPostsByCategoryDto } from './dto/category/get-posts-by-category.dto';
import { Post } from './entity/post.entity';
import { Category } from './entity/category.entity';
import { Like } from './entity/like.entity';
import { Comment } from './entity/comment.entity';
import { UserService } from 'src/user/user.service';
import { UploadService } from 'src/upload/upload.service';
import { extname } from 'path';
import { UpdatePostDto } from './dto/post/update-post.dto';
import { CreatePostDto } from './dto/post/create-post.dto';
import { SearchPostDto } from './dto/post/search-post.dto';
import { AddCommentDto } from './dto/comment/add-comment.dto';
import { UpdateCommentDto } from './dto/comment/update-comment.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  //-----------------------------------category----------------------------------------------------

  // 모든 카테고리 조회
  async findAllCategories() {
    return this.categoryRepository.find({
      where: { category: Not('default') },
    });
  }

  // 카테고리 이름으로 단일 카테고리 조회
  async findCategoryByName(category: string) {
    return this.categoryRepository.findOne({ where: { category } });
  }

  // 카테고리 ID로 단일 카테고리 조회
  private async findOneCategory(categoryId: number) {
    return this.categoryRepository.findOne({
      where: { id: categoryId },
    });
  }

  // 특정 카테고리에 속한 게시글 조회
  async findPostsByCategory(getPostsByCategoryDto: GetPostsByCategoryDto) {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .loadRelationCountAndMap('post.likecount', 'post.likes')
      .loadRelationCountAndMap('post.commentcount', 'post.comments')
      .where('category.category = :category', {
        category: getPostsByCategoryDto.category,
      })
      .orderBy('post.createdAt', 'DESC')
      .getMany();

    return posts.map((post) => ({
      ...post,
      user: {
        id: post.author.id,
        email: post.author.email,
        name: post.author.name,
        profile_image: post.author.profileImage,
      },
    }));
  }

  //-----------------------------------post----------------------------------------------------
  // 모든 게시글 조회
  async findAll() {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .loadRelationCountAndMap('post.likecount', 'post.likes')
      .loadRelationCountAndMap('post.commentcount', 'post.comments')
      .orderBy('post.createdAt', 'DESC')
      .getMany();

    return posts.map((post) => ({
      ...post,
      user: {
        id: post.author.id,
        email: post.author.email,
        name: post.author.name,
        profile_image: post.author.profileImage,
      },
    }));
  }

  // 게시글 ID로 조회
  async findOne(postId: number) {
    return this.postRepository.findOne({
      where: { id: postId },
      relations: ['author'],
    });
  }

  // 유저 이메일로 게시글 조회
  async findByUserEmail(email: string) {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .loadRelationCountAndMap('post.likecount', 'post.likes')
      .loadRelationCountAndMap('post.commentcount', 'post.comments')
      .where('author.email = :email', { email: email })
      .orderBy('post.createdAt', 'DESC')
      .getMany();

    return posts.map((post) => ({
      ...post,
      user: {
        id: post.author.id,
        email: post.author.email,
        name: post.author.name,
        profile_image: post.author.profileImage,
      },
    }));
  }

  // 유저 아이디로 게시글 조회
  async findByUserId(userId: number) {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .loadRelationCountAndMap('post.likecount', 'post.likes')
      .loadRelationCountAndMap('post.commentcount', 'post.comments')
      .where('author.id = :userId', { userId: userId })
      .orderBy('post.createdAt', 'DESC')
      .getMany();

    return posts.map((post) => ({
      ...post,
      user: {
        id: post.author.id,
        email: post.author.email,
        name: post.author.name,
        profile_image: post.author.profileImage,
      },
    }));
  }

  //게시글 파일 업로드드
  async uploadPostFiles(userId: number, files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('파일이 없습니다.');
    }
    const defaultCategory = await this.findCategoryByName('default');

    const savedPost = await this.postRepository.save({
      title: 'Untitled',
      content: '',
      author: { id: userId },
      category: defaultCategory,
    });
    const postId = savedPost.id;

    const uploadPath = `./uploads/${postId}`;
    const fileUrls = {};

    await Promise.all(
      files.map(async (file, index) => {
        const filename = `${Date.now()}-${index}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        const fileUrl = await this.uploadService.uploadFile(
          file,
          uploadPath,
          filename,
        );
        fileUrls[file.originalname] = fileUrl;
      }),
    );

    return {
      message: '파일이 성공적으로 업로드 되었습니다.',
      postId: postId,
      fileUrls: fileUrls,
    };
  }

  // 게시글 생성
  async create(createPostDto: CreatePostDto) {
    const category = await this.findCategoryByName(createPostDto.category);

    const post = await this.findOne(createPostDto.postId);

    if (!post) {
      throw new NotFoundException(
        `ID가 ${createPostDto.postId}인 게시글을 찾을 수 없습니다.`,
      );
    }

    post.title = createPostDto.title;
    post.content = createPostDto.content;
    post.category = category;

    const updatedPost = await this.postRepository.save(post);

    return {
      ...updatedPost,
      user: {
        id: post.author.id,
        email: post.author.email,
        name: post.author.name,
        profile_image: post.author.profileImage,
      },
      likecount: 0,
      comments: [],
    };
  }

  // 게시글 삭제
  async remove(postId: number) {
    const result = await this.postRepository.delete(postId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `ID가 ${postId}인 게시글을 찾을 수 없습니다.`,
      );
    }
    return { message: '게시글이 삭제되었습니다.', id: postId };
  }

  // 게시글 조회수 증가
  async increaseView(postId: number) {
    const result = await this.postRepository.update(postId, {
      viewCount: () => 'viewCount + 1',
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `ID가 ${postId}인 게시글을 찾을 수 없습니다.`,
      );
    }
    return { message: '조회수가 증가되었습니다.', id: postId };
  }

  //게시글 업데이트
  async update(postId: number, updates: UpdatePostDto) {
    const post = await this.findOne(postId);

    post.title = updates.title;
    post.content = updates.content;
    post.category = await this.findCategoryByName(updates.category);

    await this.postRepository.save(post);

    const updatedPost = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .loadRelationCountAndMap('post.likecount', 'post.likes')
      .loadRelationCountAndMap('post.commentcount', 'post.comments')
      .where('post.id = :id', { id: post.id })
      .getOne();

    return {
      ...updatedPost,
      user: {
        id: updatedPost.author.id,
        email: updatedPost.author.email,
        name: updatedPost.author.name,
        profile_image: updatedPost.author.profileImage,
      },
    };
  }

  // 조회수 상위 n개 게시글 조회
  async findTop(n: number) {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .loadRelationCountAndMap('post.likecount', 'post.likes')
      .loadRelationCountAndMap('post.commentcount', 'post.comments')
      .orderBy('post.viewCount', 'DESC')
      .limit(n)
      .getMany();

    return posts.map((post) => ({
      ...post,
      user: {
        id: post.author.id,
        email: post.author.email,
        name: post.author.name,
        profile_image: post.author.profileImage,
      },
    }));
  }

  //검색어로 게시글 조회
  async search(searchPostDto: SearchPostDto) {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category')
      .loadRelationCountAndMap('post.likecount', 'post.likes')
      .loadRelationCountAndMap('post.commentcount', 'post.comments');

    if (searchPostDto.type === 'title') {
      query.where('post.title LIKE :keyword', {
        keyword: `%${searchPostDto.keyword}%`,
      });
    } else if (searchPostDto.type === 'content') {
      query.where('post.content LIKE :keyword', {
        keyword: `%${searchPostDto.keyword}%`,
      });
    } else {
      query.where('post.title LIKE :keyword OR post.content LIKE :keyword', {
        keyword: `%${searchPostDto.keyword}%`,
      });
    }

    if (searchPostDto.category) {
      query.andWhere('category.category = :category', {
        category: searchPostDto.category,
      });
    }

    const posts = await query.orderBy('post.createdAt', 'DESC').getMany();

    return posts.map((post) => ({
      ...post,
      user: {
        id: post.author.id,
        email: post.author.email,
        name: post.author.name,
        profile_image: post.author.profileImage,
      },
    }));
  }

  //-----------------------------------like----------------------------------------------------

  async toggleLike(user: User, postId: number) {
    const existingLike = await this.likeRepository.findOne({
      where: { user: { id: user.id }, post: { id: postId } },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      return { message: '좋아요 취소', liked: false };
    } else {
      const like = this.likeRepository.create({
        user: { id: user.id },
        post: { id: postId },
      });
      await this.likeRepository.save(like);
      return { message: '좋아요 성공', liked: true };
    }
  }

  async findLike(userId: number, postId: number) {
    const like = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });
    return !!like;
  }

  async findLikeCount(postId: number) {
    return this.likeRepository.count({
      where: { post: { id: postId } },
    });
  }

  //----------------------comment----------------------------------

  async findComments(postId: number, page: number) {
    const comments = await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['author', 'parent'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * 20,
      take: 20,
    });

    return comments.map((comment) => ({
      id: comment.id,
      comment: comment.comment,
      createdAt: comment.createdAt,
      author: comment.author?.id,
      user_name: comment.author?.name,
      profile_image: comment.author?.profileImage,
      parent: comment.parent?.id ?? null,
    }));
  }

  //전체 댓글의 개수 조회
  async findCommentCount(postId: number): Promise<number> {
    return this.commentRepository.count({
      where: { post: { id: postId } },
    });
  }

  //댓글 추가
  async createComment(
    userId: number,
    postId: number,
    addCommentDto: AddCommentDto,
  ) {
    const post = await this.findOne(postId);
    if (!post) throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');

    let parentComment = null;
    if (addCommentDto.parentId) {
      parentComment = await this.commentRepository.findOne({
        where: { id: addCommentDto.parentId },
      });
      if (!parentComment)
        throw new NotFoundException('부모 댓글이 존재하지 않습니다.');
    }

    const newComment = this.commentRepository.create({
      author: { id: userId },
      post: post,
      parent: parentComment,
      comment: addCommentDto.comment,
    });

    const savedComment = await this.commentRepository.save(newComment);

    const fullComment = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['author', 'parent'],
    });

    return {
      id: fullComment.id,
      comment: fullComment.comment,
      createdAt: fullComment.createdAt,
      author: fullComment.author.id,
      user_name: fullComment.author.name,
      profile_image: fullComment.author.profileImage,
      parent: fullComment.parent?.id ?? null,
    };
  }

  //댓글 삭제
  async removeComment(userId: number, commentId: number) {
    const result = await this.commentRepository.delete(commentId);
    if (result.affected === 0) {
      throw new NotFoundException(
        `ID가 ${commentId}인 댓글을 찾을 수 없습니다.`,
      );
    }
    return { message: '댓글이 삭제되었습니다.', id: commentId };
  }

  //댓글 수정
  async updateComment(
    userId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    const result = await this.commentRepository.update(commentId, {
      comment: updateCommentDto.comment,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `ID가 ${commentId}인 댓글을 찾을 수 없습니다.`,
      );
    }

    const updatedComment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author', 'parent'],
    });

    return {
      id: updatedComment.id,
      comment: updatedComment.comment,
      createdAt: updatedComment.createdAt,
      author: updatedComment.author.id,
      user_name: updatedComment.author.name,
      profile_image: updatedComment.author.profileImage,
      parent: updatedComment.parent?.id ?? null,
    };
  }
}
