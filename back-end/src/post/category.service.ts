import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { PostCategory } from './enum/post-category.enum';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class CategoryService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly cacheService: CacheService,
  ) {}

  async onModuleInit() {
    // 서버가 시작될 때 자동으로 실행
    await this.initRepository();
  }

  async initRepository() {
    const defaultCategories = Object.values(PostCategory).map((category) => ({
      category,
    }));

    for (const category of defaultCategories) {
      const exists = await this.categoryRepository.findOne({
        where: { category: category.category },
      });
      if (!exists) {
        await this.categoryRepository.save(category);
      }
    }

    const categories = await this.categoryRepository.find({
      where: { category: Not('default') },
    });

    await this.cacheService.set('categories', categories, 86400000, 'category');

    console.log('Default categories initialized');
  }
}
