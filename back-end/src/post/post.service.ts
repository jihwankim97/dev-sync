import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Not, Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { GetPostsByCategoryDto } from './dto/category/get-posts-by-category.dto';
import { Post } from './entities/post.entity';
import { Category } from './entities/category.entity';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { UserService } from 'src/user/user.service';
import { UploadService } from 'src/upload/upload.service';
import { extname } from 'path';
import { UpdatePostDto } from './dto/post/update-post.dto';

@Injectable()
export class PostsService {
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
  async getCategories() {
    return await this.categoryRepository.find({
      where: { category: Not('default') },
    });
  }

  // 카테고리 이름으로 단일 카테고리 조회
  async getCategoryByName(category: string) {
    return await this.categoryRepository.findOne({ where: { category } });
  }

  // 카테고리 ID로 단일 카테고리 조회
  private async findCategoryById(category_id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id: category_id },
    });
    if (!category) {
      throw new NotFoundException(
        `ID가 ${category_id}인 카테고리를 찾을 수 없습니다.`,
      );
    }
    return category;
  }

  // 특정 카테고리에 속한 게시글 조회
  async getPostsByCategory(getPostsByCategoryDto: GetPostsByCategoryDto) {
    const category = await this.getCategoryByName(
      getPostsByCategoryDto.category,
    );

    const posts = await this.postRepository.find({
      where: {
        category: {
          id: category.id,
        },
      },
      relations: ['user', 'category'],
      order: {
        createdAt: 'DESC', // 최신순 정렬 (선택 사항)
      },
    });

    const processedPosts = await Promise.all(
      posts.map(async (post) => {
        const { user, id } = post;
        const slimUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          profile_image: user.profileImage,
        };

        const likecount = await this.getLikeCount(id);
        const commentcount = await this.getCommentCount(id);

        return {
          ...post,
          user: slimUser,
          likecount: likecount,
          commentcount: commentcount,
        };
      }),
    );

    return processedPosts;
  }

  //-----------------------------------post----------------------------------------------------
  // 모든 게시글 조회
  async getAllPosts() {
    const posts = await this.postRepository.find({
      relations: ['user', 'category'],
    });

    const processedPosts = await Promise.all(
      posts.map(async (post) => {
        const { user, id } = post;
        const slimUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          profile_image: user.profileImage,
        };

        const likecount = await this.getLikeCount(id);
        const commentcount = await this.getCommentCount(id);

        return {
          ...post,
          user: slimUser,
          likecount: likecount,
          commentcount: commentcount,
        };
      }),
    );

    return processedPosts;
  }

  // 게시글 ID로 조회
  private async findPostById(post_id: number) {
    const post = await this.postRepository.findOne({
      where: { id: post_id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(
        `ID가 ${post_id}인 게시글을 찾을 수 없습니다.`,
      );
    }

    return post;
  }

  // 유저 아이디로 게시글 조회
  async getPostsByUserId(user_id: number) {
    const posts = await this.postRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'category'],
    });

    const processedPosts = await Promise.all(
      posts.map(async (post) => {
        const { user, id } = post;
        const slimUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          profile_image: user.profileImage,
        };

        const likecount = await this.getLikeCount(id);
        const commentcount = await this.getCommentCount(id);

        return {
          ...post,
          user: slimUser,
          likecount: likecount,
          commentcount: commentcount,
        };
      }),
    );

    return processedPosts;
  }

  //게시글 파일 업로드드
  async uploadPostFiles(user_id: number, files: Express.Multer.File[]) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException(
        `ID가 ${user_id}인 사용자를 찾을 수 없습니다.`,
      );
    }

    const defaultCategory = await this.categoryRepository.findOne({
      where: { category: 'default' },
    });

    if (!defaultCategory) {
      throw new NotFoundException(`기본 카테고리를 찾을 수 없습니다.`);
    }

    const newPost = this.postRepository.create({
      title: 'Untitled',
      content: '',
      user: user,
      category: defaultCategory,
    });
    const savedPost = await this.postRepository.save(newPost);
    const postId = savedPost.id.toString();

    const uploadPath = `./uploads/${postId}`;
    const fileUrls = {};

    for (const file of files) {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      const fileUrl = await this.uploadService.uploadFile(
        file,
        uploadPath,
        filename,
      );

      fileUrls[file.originalname] = fileUrl;
    }

    return { postId: postId, fileUrls: fileUrls };
  }

  // 게시글 생성
  async createPost(
    user_id: number,
    post_id: number,
    title: string,
    content: string,
    category_name: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException(
        `ID가 ${user_id}인 사용자를 찾을 수 없습니다.`,
      );
    }

    const category = await this.getCategoryByName(category_name);
    if (!category) {
      throw new NotFoundException(
        `카테고리 '${category_name}'을(를) 찾을 수 없습니다.`,
      );
    }

    const post = await this.postRepository.findOne({ where: { id: post_id } });
    if (!post) {
      throw new NotFoundException(
        `ID가 ${post_id}인 게시글을 찾을 수 없습니다.`,
      );
    }

    post.title = title;
    post.content = content;
    post.category = category;

    const updatedPost = await this.postRepository.save(post);

    const likecount = await this.getLikeCount(post.id);
    const comments = await this.getComment(post.id, 1);

    const slimUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      profile_image: user.profileImage,
    };

    return {
      ...updatedPost,
      user: slimUser,
      likecount,
      comments,
    };
  }

  // 게시글 삭제
  async deletePost(post_id: number) {
    const post = await this.findPostById(post_id);
    return await this.postRepository.remove(post);
  }

  // 게시글 조회수 증가
  async increaseViewCount(post_id: number) {
    const post = await this.findPostById(post_id);
    post.viewCount += 1;
    return await this.postRepository.save(post);
  }
  //게시글 업데이트
  async updatePost(
    user_id: number, // 요청한 유저의 ID
    post_id: number,
    updates: UpdatePostDto,
  ) {
    const post = await this.findPostById(post_id);

    // 작성자인지 확인
    if (post.user.id !== user_id) {
      throw new BadRequestException('수정 권한이 없습니다.');
    }

    // 제목 수정
    if (updates.title) {
      post.title = updates.title;
    }

    // 내용 수정
    if (updates.content) {
      post.content = updates.content;
    }

    // 카테고리 변경 (카테고리 이름으로 ID 조회)
    if (updates.category) {
      const category = await this.getCategoryByName(updates.category);
      if (!category) {
        throw new NotFoundException(
          `카테고리 '${updates.category}'를 찾을 수 없습니다.`,
        );
      }
      post.category = category;
    }

    const updatedPost = await this.postRepository.save(post);

    const likecount = await this.getLikeCount(post.id);
    const comments = await this.getComment(post.id, 1);
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    const slimUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      profile_image: user.profileImage,
    };

    return {
      ...updatedPost,
      user: slimUser,
      likecount,
      comments,
    };
  }

  // 조회수 상위 n개 게시글 조회
  async getTopPosts(n: number) {
    return await this.postRepository.find({
      order: { viewCount: 'DESC' },
      take: n,
    });
  }

  //검색어로 게시글 조회
  async searchPosts(keyword: string, category: string, type: string = 'all') {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.category', 'category');

    if (type === 'title') {
      query.where('post.title LIKE :keyword', { keyword: `%${keyword}%` });
    } else if (type === 'content') {
      query.where('post.content LIKE :keyword', { keyword: `%${keyword}%` });
    } else {
      // all or undefined
      query.where('post.title LIKE :keyword OR post.content LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    if (category) {
      query.andWhere('category.category = :category', { category });
    }

    const posts = await query.orderBy('post.createdAt', 'DESC').getMany();

    const processedPosts = await Promise.all(
      posts.map(async (post) => {
        const likecount = await this.getLikeCount(post.id);
        const commentcount = await this.getCommentCount(post.id);

        const slimUser = {
          id: post.user.id,
          email: post.user.email,
          name: post.user.name,
          profile_image: post.user.profileImage,
        };

        return {
          ...post,
          user: slimUser,
          likecount,
          commentcount,
        };
      }),
    );

    return processedPosts;
  }

  //-----------------------------------like----------------------------------------------------

  async getLike(user_id: number, post_id: number): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { user: { id: user_id }, post: { id: post_id } },
    });
    return !!like;
  }
  async getLikeCount(post_id: number) {
    return await this.likeRepository.count({
      where: { post: { id: post_id } },
    });
  }

  async toggleLike(user_id: number, post_id: number) {
    const existingLike = await this.getLike(user_id, post_id);

    if (existingLike) {
      return await this.removelike(user_id, post_id);
    } else {
      return await this.addlike(user_id, post_id);
    }
  }

  private async addlike(user_id: number, post_id: number) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new Error('해당 유저가 존재하지 않음');
    }

    const post = await this.postRepository.findOne({ where: { id: post_id } });
    if (!post) {
      throw new Error('해당 게시물이 존재하지 않음');
    }

    const like = new Like();
    like.user = user;
    like.post = post;

    await this.likeRepository.save(like);

    return { message: '좋아요 성공' };
  }

  private async removelike(user_id: number, post_id: number) {
    const like = await this.likeRepository.findOne({
      where: { user: { id: user_id }, post: { id: post_id } },
    });

    if (!like) {
      throw new Error('좋아요가 없음');
    }

    await this.likeRepository.remove(like);

    return { message: '좋아요 취소' };
  }

  //----------------------comment----------------------------------

  async getComment(post_id: number, page: number) {
    const comments = await this.commentRepository.find({
      where: { post: { id: post_id } },
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
  async getCommentCount(post_id: number): Promise<number> {
    return await this.commentRepository.count({
      where: { post: { id: post_id } },
    });
  }

  //댓글 추가
  async addComment(
    user_id: number,
    post_id: number,
    parent_id: number | null,
    comment: string,
  ) {
    const user = await this.userService.getUserById(user_id);
    if (!user) throw new Error('해당 유저가 존재하지 않음');

    const post = await this.findPostById(post_id);
    if (!post) throw new Error('해당 게시글을 찾을 수 없음');

    let parentComment = null;
    if (parent_id) {
      parentComment = await this.commentRepository.findOne({
        where: { id: parent_id },
      });
      if (!parentComment) throw new Error('부모 댓글이 존재하지 않음');
    }

    const newComment = this.commentRepository.create({
      author: user,
      post: post,
      parent: parentComment,
      comment,
    });

    return await !!this.commentRepository.save(newComment);
  }

  //댓글 삭제
  async deleteComment(user_id: number, comment_id: number) {
    const user = await this.userService.getUserById(user_id);
    if (!user) throw new Error('해당 유저가 존재하지 않음');

    const target = await this.commentRepository.findOne({
      where: { id: comment_id, author: { id: user_id } },
    });

    if (!target)
      throw new Error('해당 댓글을 찾을 수 없거나 삭제할 권한이 없습니다.');

    return await this.commentRepository.remove(target);
  }

  //댓글 수정
  async updateComment(user_id: number, comment_id: number, comment: string) {
    const user = await this.userService.getUserById(user_id);
    if (!user) throw new Error('해당 유저가 존재하지 않음');

    const target = await this.commentRepository.findOne({
      where: { id: comment_id, author: { id: user_id } },
    });

    if (!target)
      throw new Error('해당 댓글을 찾을 수 없거나 수정할 권한이 없습니다.');
    else {
      target.comment = comment;
    }

    return await this.commentRepository.save(target);
  }
}
