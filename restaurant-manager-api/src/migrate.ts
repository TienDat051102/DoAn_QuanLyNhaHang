import * as bcrypt from 'bcryptjs';
import {readFileSync} from 'fs';
import {join} from 'path';
import {
  DiscountsRepository,
  InformationRepository,
  IngredientsRepository,
  MenucategoriesRepository,
  MenuItemsRepository,
  NavMenuRepository,
  TablesRepository,
  UsersRepository,
} from './repositories';

export const APP_MODELS = [
  'Customers',
  'Users',
  'Tables',
  'Reservations',
  'Information',
  'Orders',
  'OrderStatuses',
  'OrderItems',
  'NavMenu',
  'NavMenuItems',
  'MenuItems',
  'MenuCategories',
  'InventoryTransactions',
  'Ingredients',
  'Payments',
  'Discounts',
];

export async function migrate(app: any, args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  await app.boot();
  await app.migrateSchema({existingSchema, models: APP_MODELS});
  try {
    await createUserData(app);
    await createData(app);
  } catch (e) {
    console.log('lỗi', e);
  }
  process.exit(0);
}
async function createUserData(app: any) {
  const userRepo = await app.getRepository(UsersRepository);

  const existingUsers = await userRepo.find();
  if (existingUsers.length === 0) {
    const users = [
      {
        username: 'admin',
        password: 'pass123',
        email: 'test@gmail.com',
        first_name: 'Tiến',
        last_name: 'Đạt',
        role: 'admin',
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      await userRepo.create(user);
    }
    console.log('Dữ liệu người dùng đã được tạo và mật khẩu đã được mã hóa.');
  } else {
    console.log('Người dùng đã tồn tại, không cần tạo thêm.');
  }
}

async function createData(app: any) {
  // đửa dữ liệu từ file vào db
  const informationRepo = await app.getRepository(InformationRepository);
  const informationdata = JSON.parse(
    readFileSync(join(__dirname, '../src/data/information.json'), 'utf-8'), // Đọc file seed.json
  );
  // thêm bản ghi
  for (const record of informationdata) {
    const ktdata = await informationRepo.findOne({
      where: {id: record.id},
    });

    if (!ktdata) {
      const {id, ...dataToCreate} = record; // Tách id ra khỏi record
      await informationRepo.create(dataToCreate); // Gọi create với data không có id
    } else {
      console.log(`Bản ghi với ID ${record.id} đã tồn tại.`);
    }
  }
  console.log('Thêm dữ liệu thành công.');

  const navmenuRepo = await app.getRepository(NavMenuRepository);
  const navmenudata = JSON.parse(
    readFileSync(join(__dirname, '../src/data/nav-menu.json'), 'utf-8'),
  );
  for (const record of navmenudata) {
    const ktdata = await navmenuRepo.findOne({
      where: {id: record.id},
    });

    if (!ktdata) {
      const {id, ...dataToCreate} = record;
      await navmenuRepo.create(dataToCreate);
    } else {
      console.log(`Bản ghi với ID ${record.id} đã tồn tại.`);
    }
  }
  console.log('Thêm dữ liệu thành công.');

  const menuitemRepo = await app.getRepository(MenuItemsRepository);
  const menuitemdata = JSON.parse(
    readFileSync(join(__dirname, '../src/data/menu-item.json'), 'utf-8'),
  );
  for (const record of menuitemdata) {
    const ktdata = await menuitemRepo.findOne({
      where: {id: record.id},
    });
    if (!ktdata) {
      const {id, ...dataToCreate} = record;
      await menuitemRepo.create(dataToCreate);
    } else {
      console.log(`Bản ghi với ID ${record.id} đã tồn tại.`);
    }
  }
  console.log('Thêm dữ liệu món ăn thành công.');

  const ingredientsRepo = await app.getRepository(IngredientsRepository);
  const ingredientsdata = JSON.parse(
    readFileSync(join(__dirname, '../src/data/ingredients.json'), 'utf-8'),
  );
  for (const record of ingredientsdata) {
    const ktdata = await ingredientsRepo.findOne({
      where: {id: record.id},
    });
    if (!ktdata) {
      const {id, ...dataToCreate} = record;
      await ingredientsRepo.create(dataToCreate);
    } else {
      console.log(`Bản ghi với ID ${record.id} đã tồn tại.`);
    }
  }
  console.log('Thêm dữ liệu nguyên liệu thành công.');

  const menucategoriesRepo = await app.getRepository(MenucategoriesRepository);
  const menucategoriesdata = JSON.parse(
    readFileSync(join(__dirname, '../src/data/menu-categories.json'), 'utf-8'),
  );
  for (const record of menucategoriesdata) {
    const ktdata = await menucategoriesRepo.findOne({
      where: {id: record.id},
    });
    if (!ktdata) {
      const {id, ...dataToCreate} = record;
      await menucategoriesRepo.create(dataToCreate);
    } else {
      console.log(`Bản ghi với ID ${record.id} đã tồn tại.`);
    }
  }
  console.log('Thêm dữ liệu danh mục món ăn thành công.');

  const tablesRepo = await app.getRepository(TablesRepository);
  const tablesRepodata = JSON.parse(
    readFileSync(join(__dirname, '../src/data/table.json'), 'utf-8'),
  );
  for (const record of tablesRepodata) {
    const ktdata = await tablesRepo.findOne({
      where: {id: record.id},
    });
    if (!ktdata) {
      const {id, ...dataToCreate} = record;
      await tablesRepo.create(dataToCreate);
    } else {
      console.log(`Bản ghi với ID ${record.id} đã tồn tại.`);
    }
  }
  console.log('Thêm dữ liệu bàn thành công.');

  const discountsRepo = await app.getRepository(DiscountsRepository);
  const discountsRepodata = JSON.parse(
    readFileSync(join(__dirname, '../src/data/discouns.json'), 'utf-8'),
  );
  for (const record of discountsRepodata) {
    const ktdata = await discountsRepo.findOne({
      where: {id: record.id},
    });
    if (!ktdata) {
      const {id, ...dataToCreate} = record;
      await discountsRepo.create(dataToCreate);
    } else {
      console.log(`Bản ghi với ID ${record.id} đã tồn tại.`);
    }
  }
  console.log('Thêm dữ liệu giảm giá thành công.');
}
