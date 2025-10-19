import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostService } from '../post.service';

@Injectable()
export class PostOwnershipGuard implements CanActivate {
  constructor(private readonly postService: PostService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const postId = request.params.id;

    const post = await this.postService.findOne(postId);
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    if (post.author.id !== user.id) throw new ForbiddenException('권한 없음');

    return true;
  }
}
