/**
 * Database Seed Script
 * Run: npx prisma db seed
 */

import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.creditTransaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.batchItem.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.globalSettings.deleteMany();

  console.log('✓ Cleaned existing data');

  // ============================================
  // GLOBAL SETTINGS
  // ============================================
  const settings = await prisma.globalSettings.create({
    data: {
      id: 'global-settings',
      stockVisibilityPercentage: 40,
      defaultMarkupPercentage: 40,
      eurToGelRate: new Prisma.Decimal('3.50'),
      minOrderAmount: new Prisma.Decimal('50'),
      maxOrderItems: 100,
      orderCutoffHour: 18,
      maintenanceMode: false,
    },
  });
  console.log('✓ Global settings created');

  // ============================================
  // USERS
  // ============================================
  const hashedPassword = await hashPassword('password123');

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@florca.ge',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      balance: new Prisma.Decimal('0'),
      emailVerified: true,
      isReseller: false,
      isVip: false,
    },
  });

  const operatorUser = await prisma.user.create({
    data: {
      email: 'operator@florca.ge',
      password: hashedPassword,
      firstName: 'Operator',
      lastName: 'User',
      role: 'OPERATOR',
      balance: new Prisma.Decimal('0'),
      emailVerified: true,
      isReseller: false,
      isVip: false,
    },
  });

  const logisticsUser = await prisma.user.create({
    data: {
      email: 'logistics@florca.ge',
      password: hashedPassword,
      firstName: 'Logistics',
      lastName: 'Manager',
      role: 'LOGISTICS',
      balance: new Prisma.Decimal('0'),
      emailVerified: true,
      isReseller: false,
      isVip: false,
    },
  });

  const accountantUser = await prisma.user.create({
    data: {
      email: 'accountant@florca.ge',
      password: hashedPassword,
      firstName: 'Accountant',
      lastName: 'User',
      role: 'ACCOUNTANT',
      balance: new Prisma.Decimal('0'),
      emailVerified: true,
      isReseller: false,
      isVip: false,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      firstName: 'Regular',
      lastName: 'Customer',
      role: 'USER',
      balance: new Prisma.Decimal('150.00'),
      emailVerified: true,
      isReseller: false,
      isVip: false,
    },
  });

  const resellerUser = await prisma.user.create({
    data: {
      email: 'reseller@example.com',
      password: hashedPassword,
      firstName: 'Reseller',
      lastName: 'Business',
      role: 'RESELLER',
      balance: new Prisma.Decimal('500.00'),
      emailVerified: true,
      isReseller: true,
      isVip: false,
    },
  });

  const vipUser = await prisma.user.create({
    data: {
      email: 'vip@example.com',
      password: hashedPassword,
      firstName: 'VIP',
      lastName: 'Customer',
      role: 'USER',
      balance: new Prisma.Decimal('1000.00'),
      emailVerified: true,
      isReseller: false,
      isVip: true,
    },
  });

  console.log('✓ Users created (7)');

  // ============================================
  // CATEGORIES
  // ============================================
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Roses', slug: 'roses', description: 'All types of roses' },
    }),
    prisma.category.create({
      data: { name: 'Tulips', slug: 'tulips', description: 'Fresh tulips from Holland' },
    }),
    prisma.category.create({
      data: { name: 'Lilies', slug: 'lilies', description: 'Oriental and Asiatic lilies' },
    }),
    prisma.category.create({
      data: { name: 'Chrysanthemums', slug: 'chrysanthemums', description: 'Spray and single chrysanthemums' },
    }),
    prisma.category.create({
      data: { name: 'Gerberas', slug: 'gerberas', description: 'Colorful gerbera daisies' },
    }),
    prisma.category.create({
      data: { name: 'Hydrangeas', slug: 'hydrangeas', description: 'Premium hydrangeas' },
    }),
    prisma.category.create({
      data: { name: 'Orchids', slug: 'orchids', description: 'Exotic orchids' },
    }),
    prisma.category.create({
      data: { name: 'Greenery', slug: 'greenery', description: 'Foliage and greenery' },
    }),
  ]);

  const [roses, tulips, lilies, chrysanthemums, gerberas, hydrangeas, orchids, greenery] = categories;
  console.log('✓ Categories created (8)');

  // ============================================
  // PRODUCTS
  // ============================================
  const products = await Promise.all([
    // ROSES - Holland
    prisma.product.create({
      data: {
        name: 'Red Naomi Rose',
        nameFa: 'رز قرمز نعومی',
        description: 'Premium red rose, long-lasting, velvety petals',
        categoryId: roses.id,
        origin: 'HOLLAND',
        stemLengthCm: 60,
        stemsPerBunch: 20,
        colorGroup: 'Red',
        priceEur: new Prisma.Decimal('1.20'),
        priceGel: new Prisma.Decimal('5.88'),
        markupPercentage: 40,
        availableQty: 500,
        status: 'ACTIVE',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'White Avalanche Rose',
        nameFa: 'رز سفید آوالانش',
        description: 'Classic white rose, perfect for weddings',
        categoryId: roses.id,
        origin: 'HOLLAND',
        stemLengthCm: 60,
        stemsPerBunch: 20,
        colorGroup: 'White',
        priceEur: new Prisma.Decimal('1.30'),
        priceGel: new Prisma.Decimal('6.37'),
        markupPercentage: 40,
        availableQty: 300,
        status: 'ACTIVE',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pink Sweet Avalanche Rose',
        description: 'Soft pink garden-style rose',
        categoryId: roses.id,
        origin: 'HOLLAND',
        stemLengthCm: 50,
        stemsPerBunch: 20,
        colorGroup: 'Pink',
        priceEur: new Prisma.Decimal('1.40'),
        priceGel: new Prisma.Decimal('6.86'),
        markupPercentage: 40,
        availableQty: 200,
        status: 'ACTIVE',
        isActive: true,
      },
    }),

    // ROSES - Ecuador
    prisma.product.create({
      data: {
        name: 'Freedom Red Rose',
        description: 'Large-headed Ecuadorian red rose',
        categoryId: roses.id,
        origin: 'ECUADOR',
        stemLengthCm: 70,
        stemsPerBunch: 25,
        colorGroup: 'Red',
        priceEur: new Prisma.Decimal('1.80'),
        priceGel: new Prisma.Decimal('8.82'),
        markupPercentage: 40,
        availableQty: 400,
        status: 'ACTIVE',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Explorer Pink Rose',
        description: 'Hot pink Ecuadorian rose, large bloom',
        categoryId: roses.id,
        origin: 'ECUADOR',
        stemLengthCm: 70,
        stemsPerBunch: 25,
        colorGroup: 'Pink',
        priceEur: new Prisma.Decimal('1.90'),
        priceGel: new Prisma.Decimal('9.31'),
        markupPercentage: 40,
        availableQty: 250,
        status: 'ACTIVE',
        isActive: true,
      },
    }),

    // TULIPS
    prisma.product.create({
      data: {
        name: 'Red Tulip Strong Gold',
        description: 'Classic red tulip from Holland',
        categoryId: tulips.id,
        origin: 'HOLLAND',
        stemLengthCm: 45,
        stemsPerBunch: 10,
        colorGroup: 'Red',
        priceEur: new Prisma.Decimal('0.60'),
        priceGel: new Prisma.Decimal('2.94'),
        markupPercentage: 40,
        availableQty: 1000,
        status: 'ACTIVE',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Yellow Tulip Jan van Nes',
        description: 'Bright yellow Dutch tulip',
        categoryId: tulips.id,
        origin: 'HOLLAND',
        stemLengthCm: 45,
        stemsPerBunch: 10,
        colorGroup: 'Yellow',
        priceEur: new Prisma.Decimal('0.55'),
        priceGel: new Prisma.Decimal('2.70'),
        markupPercentage: 40,
        availableQty: 800,
        status: 'ACTIVE',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Purple Tulip Purple Prince',
        description: 'Deep purple Dutch tulip',
        categoryId: tulips.id,
        origin: 'HOLLAND',
        stemLengthCm: 45,
        stemsPerBunch: 10,
        colorGroup: 'Purple',
        priceEur: new Prisma.Decimal('0.65'),
        priceGel: new Prisma.Decimal('3.19'),
        markupPercentage: 40,
        availableQty: 600,
        status: 'ACTIVE',
        isActive: true,
      },
    }),

    // LILIES
    prisma.product.create({
      data: {
        name: 'White Oriental Lily Siberia',
        description: 'Large white fragrant lily',
        categoryId: lilies.id,
        origin: 'HOLLAND',
        stemLengthCm: 80,
        stemsPerBunch: 5,
        colorGroup: 'White',
        priceEur: new Prisma.Decimal('2.50'),
        priceGel: new Prisma.Decimal('12.25'),
        markupPercentage: 40,
        availableQty: 150,
        status: 'ACTIVE',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pink Oriental Lily Sorbonne',
        description: 'Pink spotted oriental lily',
        categoryId: lilies.id,
        origin: 'HOLLAND',
        stemLengthCm: 80,
        stemsPerBunch: 5,
        colorGroup: 'Pink',
        priceEur: new Prisma.Decimal('2.60'),
        priceGel: new Prisma.Decimal('12.74'),
        markupPercentage: 40,
        availableQty: 120,
        status: 'ACTIVE',
        isActive: true,
      },
    }),

    // CHRYSANTHEMUMS
    prisma.product.create({
      data: {
        name: 'White Spray Chrysanthemum',
        description: 'Multi-bloom white spray mum',
        categoryId: chrysanthemums.id,
        origin: 'HOLLAND',
        stemLengthCm: 70,
        stemsPerBunch: 10,
        colorGroup: 'White',
        priceEur: new Prisma.Decimal('0.80'),
        priceGel: new Prisma.Decimal('3.92'),
        markupPercentage: 40,
        availableQty: 400,
        status: 'ACTIVE',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Yellow Disbud Chrysanthemum',
        description: 'Single large yellow bloom',
        categoryId: chrysanthemums.id,
        origin: 'HOLLAND',
        stemLengthCm: 70,
        stemsPerBunch: 10,
        colorGroup: 'Yellow',
        priceEur: new Prisma.Decimal('0.90'),
        priceGel: new Prisma.Decimal('4.41'),
        markupPercentage: 40,
        availableQty: 350,
        status: 'ACTIVE',
        isActive: true,
      },
    }),

    // GERBERAS
    prisma.product.create({
      data: {
        name: 'Mixed Gerbera Standard',
        description: 'Assorted colors gerbera daisies',
        categoryId: gerberas.id,
        origin: 'HOLLAND',
        stemLengthCm: 50,
        stemsPerBunch: 10,
        colorGroup: 'Mixed',
        priceEur: new Prisma.Decimal('0.70'),
        priceGel: new Prisma.Decimal('3.43'),
        markupPercentage: 40,
        availableQty: 500,
        status: 'ACTIVE',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Red Gerbera Germini',
        description: 'Small red mini gerbera',
        categoryId: gerberas.id,
        origin: 'HOLLAND',
        stemLengthCm: 45,
        stemsPerBunch: 10,
        colorGroup: 'Red',
        priceEur: new Prisma.Decimal('0.50'),
        priceGel: new Prisma.Decimal('2.45'),
        markupPercentage: 40,
        availableQty: 600,
        status: 'ACTIVE',
        isActive: true,
      },
    }),

    // HYDRANGEAS
    prisma.product.create({
      data: {
        name: 'Blue Hydrangea',
        description: 'Large blue hydrangea head',
        categoryId: hydrangeas.id,
        origin: 'HOLLAND',
        stemLengthCm: 60,
        stemsPerBunch: 5,
        colorGroup: 'Blue',
        priceEur: new Prisma.Decimal('4.00'),
        priceGel: new Prisma.Decimal('19.60'),
        markupPercentage: 40,
        availableQty: 80,
        status: 'ACTIVE',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'White Hydrangea',
        description: 'Pure white hydrangea head',
        categoryId: hydrangeas.id,
        origin: 'HOLLAND',
        stemLengthCm: 60,
        stemsPerBunch: 5,
        colorGroup: 'White',
        priceEur: new Prisma.Decimal('4.20'),
        priceGel: new Prisma.Decimal('20.58'),
        markupPercentage: 40,
        availableQty: 60,
        status: 'ACTIVE',
        isActive: true,
      },
    }),

    // ORCHIDS
    prisma.product.create({
      data: {
        name: 'White Phalaenopsis Orchid',
        description: 'White moth orchid stem',
        categoryId: orchids.id,
        origin: 'HOLLAND',
        stemLengthCm: 70,
        stemsPerBunch: 1,
        colorGroup: 'White',
        priceEur: new Prisma.Decimal('6.00'),
        priceGel: new Prisma.Decimal('29.40'),
        markupPercentage: 40,
        availableQty: 40,
        status: 'ACTIVE',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Purple Dendrobium Orchid',
        description: 'Purple dendrobium spray',
        categoryId: orchids.id,
        origin: 'HOLLAND',
        stemLengthCm: 60,
        stemsPerBunch: 10,
        colorGroup: 'Purple',
        priceEur: new Prisma.Decimal('2.00'),
        priceGel: new Prisma.Decimal('9.80'),
        markupPercentage: 40,
        availableQty: 100,
        status: 'ACTIVE',
        isActive: true,
      },
    }),

    // GREENERY
    prisma.product.create({
      data: {
        name: 'Eucalyptus Cinerea',
        description: 'Silver dollar eucalyptus',
        categoryId: greenery.id,
        origin: 'HOLLAND',
        stemLengthCm: 65,
        stemsPerBunch: 10,
        colorGroup: 'Green',
        priceEur: new Prisma.Decimal('1.00'),
        priceGel: new Prisma.Decimal('4.90'),
        markupPercentage: 40,
        availableQty: 300,
        status: 'ACTIVE',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Ruscus Italian',
        description: 'Italian ruscus foliage',
        categoryId: greenery.id,
        origin: 'HOLLAND',
        stemLengthCm: 70,
        stemsPerBunch: 10,
        colorGroup: 'Green',
        priceEur: new Prisma.Decimal('0.80'),
        priceGel: new Prisma.Decimal('3.92'),
        markupPercentage: 40,
        availableQty: 400,
        status: 'ACTIVE',
        isActive: true,
      },
    }),

    // Out of stock product
    prisma.product.create({
      data: {
        name: 'Rare Black Rose',
        description: 'Limited edition black rose',
        categoryId: roses.id,
        origin: 'ECUADOR',
        stemLengthCm: 60,
        stemsPerBunch: 10,
        colorGroup: 'Black',
        priceEur: new Prisma.Decimal('5.00'),
        priceGel: new Prisma.Decimal('24.50'),
        markupPercentage: 40,
        availableQty: 0,
        status: 'ACTIVE',
        isActive: true,
      },
    }),

    // Inactive product
    prisma.product.create({
      data: {
        name: 'Seasonal Peony',
        description: 'Available only in spring',
        categoryId: roses.id,
        origin: 'HOLLAND',
        stemLengthCm: 50,
        stemsPerBunch: 10,
        colorGroup: 'Pink',
        priceEur: new Prisma.Decimal('3.50'),
        priceGel: new Prisma.Decimal('17.15'),
        markupPercentage: 40,
        availableQty: 0,
        status: 'INACTIVE',
        isActive: false,
      },
    }),
  ]);

  console.log(`✓ Products created (${products.length})`);

  // ============================================
  // BATCHES
  // ============================================
  const batch1 = await prisma.batch.create({
    data: {
      batchNumber: 'BATCH-2026-01-001',
      origin: 'HOLLAND',
      supplier: 'Dutch Flower Auctions',
      expectedArrivalDate: new Date('2026-02-10'),
      status: 'IN_TRANSIT',
      totalItems: 500,
      totalCostEur: new Prisma.Decimal('850.00'),
      notes: 'Weekly Holland shipment',
      items: {
        create: [
          { productId: products[0].id, quantityOrdered: 200, quantityReceived: 0, unitCostEur: new Prisma.Decimal('0.80') },
          { productId: products[1].id, quantityOrdered: 150, quantityReceived: 0, unitCostEur: new Prisma.Decimal('0.90') },
          { productId: products[5].id, quantityOrdered: 150, quantityReceived: 0, unitCostEur: new Prisma.Decimal('0.40') },
        ],
      },
    },
  });

  const batch2 = await prisma.batch.create({
    data: {
      batchNumber: 'BATCH-2026-01-002',
      origin: 'ECUADOR',
      supplier: 'Ecuador Premium Roses',
      expectedArrivalDate: new Date('2026-02-12'),
      status: 'ORDERED',
      totalItems: 300,
      totalCostEur: new Prisma.Decimal('540.00'),
      notes: 'Premium Ecuador roses',
      items: {
        create: [
          { productId: products[3].id, quantityOrdered: 200, quantityReceived: 0, unitCostEur: new Prisma.Decimal('1.20') },
          { productId: products[4].id, quantityOrdered: 100, quantityReceived: 0, unitCostEur: new Prisma.Decimal('1.30') },
        ],
      },
    },
  });

  const batch3 = await prisma.batch.create({
    data: {
      batchNumber: 'BATCH-2026-01-003',
      origin: 'HOLLAND',
      supplier: 'Dutch Flower Auctions',
      expectedArrivalDate: new Date('2026-01-28'),
      actualArrivalDate: new Date('2026-01-29'),
      status: 'RECEIVED',
      totalItems: 400,
      totalCostEur: new Prisma.Decimal('620.00'),
      notes: 'Received with minor delays',
      items: {
        create: [
          { productId: products[8].id, quantityOrdered: 100, quantityReceived: 100, unitCostEur: new Prisma.Decimal('1.70') },
          { productId: products[10].id, quantityOrdered: 200, quantityReceived: 195, unitCostEur: new Prisma.Decimal('0.55') },
          { productId: products[12].id, quantityOrdered: 100, quantityReceived: 100, unitCostEur: new Prisma.Decimal('0.45') },
        ],
      },
    },
  });

  console.log('✓ Batches created (3)');

  // ============================================
  // ORDERS
  // ============================================
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-202602-00001',
      userId: regularUser.id,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      paymentMethod: 'CARD',
      subtotalGel: new Prisma.Decimal('58.80'),
      discountGel: new Prisma.Decimal('0'),
      creditsUsedGel: new Prisma.Decimal('0'),
      totalGel: new Prisma.Decimal('58.80'),
      shippingAddress: 'Tbilisi, Rustaveli Ave 15',
      items: {
        create: [
          { productId: products[0].id, quantity: 10, unitPriceGel: new Prisma.Decimal('5.88') },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-202602-00002',
      userId: resellerUser.id,
      status: 'APPROVED',
      paymentStatus: 'PAID',
      paymentMethod: 'BANK_TRANSFER',
      subtotalGel: new Prisma.Decimal('294.00'),
      discountGel: new Prisma.Decimal('14.70'), // 5% volume discount
      creditsUsedGel: new Prisma.Decimal('50.00'),
      totalGel: new Prisma.Decimal('229.30'),
      shippingAddress: 'Tbilisi, Chavchavadze Ave 42',
      notes: 'Wholesale order for flower shop',
      items: {
        create: [
          { productId: products[5].id, quantity: 100, unitPriceGel: new Prisma.Decimal('2.94') },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-202602-00003',
      userId: vipUser.id,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: 'CARD',
      subtotalGel: new Prisma.Decimal('122.50'),
      discountGel: new Prisma.Decimal('0'),
      creditsUsedGel: new Prisma.Decimal('100.00'),
      totalGel: new Prisma.Decimal('22.50'),
      shippingAddress: 'Tbilisi, Saburtalo, Block 5',
      items: {
        create: [
          { productId: products[8].id, quantity: 10, unitPriceGel: new Prisma.Decimal('12.25') },
        ],
      },
    },
  });

  const order4 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-202602-00004',
      userId: regularUser.id,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: 'CASH',
      subtotalGel: new Prisma.Decimal('45.71'),
      discountGel: new Prisma.Decimal('0'),
      creditsUsedGel: new Prisma.Decimal('0'),
      totalGel: new Prisma.Decimal('45.71'),
      shippingAddress: 'Batumi, Seaside Blvd 7',
      items: {
        create: [
          { productId: products[6].id, quantity: 10, unitPriceGel: new Prisma.Decimal('2.70') },
          { productId: products[19].id, quantity: 4, unitPriceGel: new Prisma.Decimal('4.90') },
        ],
      },
    },
  });

  const order5 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-202602-00005',
      userId: resellerUser.id,
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      paymentMethod: 'BANK_TRANSFER',
      subtotalGel: new Prisma.Decimal('196.00'),
      discountGel: new Prisma.Decimal('0'),
      creditsUsedGel: new Prisma.Decimal('0'),
      totalGel: new Prisma.Decimal('196.00'),
      shippingAddress: 'Kutaisi, Central Market',
      notes: 'Cancelled - customer changed mind',
      items: {
        create: [
          { productId: products[14].id, quantity: 10, unitPriceGel: new Prisma.Decimal('19.60') },
        ],
      },
    },
  });

  console.log('✓ Orders created (5)');

  // ============================================
  // CREDIT TRANSACTIONS
  // ============================================
  await prisma.creditTransaction.createMany({
    data: [
      {
        userId: regularUser.id,
        type: 'DEPOSIT',
        amount: new Prisma.Decimal('200.00'),
        description: 'Welcome bonus credits',
      },
      {
        userId: regularUser.id,
        type: 'SPEND',
        amount: new Prisma.Decimal('50.00'),
        description: 'Used for order ORD-202601-00001',
      },
      {
        userId: resellerUser.id,
        type: 'DEPOSIT',
        amount: new Prisma.Decimal('500.00'),
        description: 'Reseller account opening bonus',
      },
      {
        userId: resellerUser.id,
        type: 'DEPOSIT',
        amount: new Prisma.Decimal('196.00'),
        description: 'Credit for cancelled order ORD-202602-00005',
      },
      {
        userId: resellerUser.id,
        type: 'SPEND',
        amount: new Prisma.Decimal('50.00'),
        description: 'Used for order ORD-202602-00002',
      },
      {
        userId: vipUser.id,
        type: 'DEPOSIT',
        amount: new Prisma.Decimal('1000.00'),
        description: 'VIP loyalty rewards',
      },
      {
        userId: vipUser.id,
        type: 'SPEND',
        amount: new Prisma.Decimal('100.00'),
        description: 'Used for order ORD-202602-00003',
      },
    ],
  });

  console.log('✓ Credit transactions created (7)');

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n🎉 Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log('   - 1 Global Settings');
  console.log('   - 7 Users (admin, operator, logistics, accountant, user, reseller, vip)');
  console.log('   - 8 Categories');
  console.log(`   - ${products.length} Products`);
  console.log('   - 3 Batches');
  console.log('   - 5 Orders');
  console.log('   - 7 Credit Transactions');
  console.log('\n🔑 Login credentials (all passwords: password123):');
  console.log('   - admin@florca.ge (ADMIN)');
  console.log('   - operator@florca.ge (OPERATOR)');
  console.log('   - logistics@florca.ge (LOGISTICS)');
  console.log('   - accountant@florca.ge (ACCOUNTANT)');
  console.log('   - user@example.com (USER - has 150 GEL credits)');
  console.log('   - reseller@example.com (RESELLER - has 500 GEL credits)');
  console.log('   - vip@example.com (VIP USER - has 1000 GEL credits)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
