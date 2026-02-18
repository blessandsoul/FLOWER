-- CreateTable
CREATE TABLE `colors` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `colors_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `growers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `growers_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `origins` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `origins_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tags_name_key`(`name`),
    UNIQUE INDEX `tags_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(500) NOT NULL,
    `color_id` INTEGER UNSIGNED NULL,
    `grower_id` INTEGER UNSIGNED NULL,
    `origin_id` INTEGER UNSIGNED NULL,
    `stock` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `order_per` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `image_url` VARCHAR(500) NULL,
    `image_filename` VARCHAR(255) NULL,
    `source_scraped_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `products_name_idx`(`name`(100)),
    INDEX `products_color_id_idx`(`color_id`),
    INDEX `products_grower_id_idx`(`grower_id`),
    INDEX `products_origin_id_idx`(`origin_id`),
    INDEX `products_stock_idx`(`stock`),
    UNIQUE INDEX `products_name_grower_id_key`(`name`, `grower_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_tags` (
    `product_id` INTEGER UNSIGNED NOT NULL,
    `tag_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`product_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `price_tiers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER UNSIGNED NOT NULL,
    `min_quantity` INTEGER UNSIGNED NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,

    INDEX `price_tiers_product_id_idx`(`product_id`),
    UNIQUE INDEX `price_tiers_product_id_min_quantity_key`(`product_id`, `min_quantity`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_images` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER UNSIGNED NOT NULL,
    `image_url` VARCHAR(500) NULL,
    `image_filename` VARCHAR(255) NULL,
    `display_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `product_images_product_id_idx`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallets` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `balance` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `wallets_user_id_key`(`user_id`),
    INDEX `wallets_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wallet_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `wallet_id` VARCHAR(191) NOT NULL,
    `type` ENUM('DEPOSIT', 'WITHDRAWAL', 'PURCHASE', 'REFUND', 'ADJUSTMENT') NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `balance_before` DECIMAL(12, 2) NOT NULL,
    `balance_after` DECIMAL(12, 2) NOT NULL,
    `description` VARCHAR(500) NULL,
    `reference_id` VARCHAR(255) NULL,
    `created_by_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `wallet_transactions_wallet_id_idx`(`wallet_id`),
    INDEX `wallet_transactions_type_idx`(`type`),
    INDEX `wallet_transactions_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_orders` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `bog_order_id` VARCHAR(255) NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `currency` VARCHAR(3) NOT NULL DEFAULT 'GEL',
    `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `callback_payload` JSON NULL,
    `redirect_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_orders_bog_order_id_key`(`bog_order_id`),
    INDEX `payment_orders_user_id_idx`(`user_id`),
    INDEX `payment_orders_status_idx`(`status`),
    INDEX `payment_orders_bog_order_id_idx`(`bog_order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_color_id_fkey` FOREIGN KEY (`color_id`) REFERENCES `colors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_grower_id_fkey` FOREIGN KEY (`grower_id`) REFERENCES `growers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_origin_id_fkey` FOREIGN KEY (`origin_id`) REFERENCES `origins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_tags` ADD CONSTRAINT `product_tags_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_tags` ADD CONSTRAINT `product_tags_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `price_tiers` ADD CONSTRAINT `price_tiers_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallets` ADD CONSTRAINT `wallets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallet_transactions` ADD CONSTRAINT `wallet_transactions_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wallet_transactions` ADD CONSTRAINT `wallet_transactions_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_orders` ADD CONSTRAINT `payment_orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
