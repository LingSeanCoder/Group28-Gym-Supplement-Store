# Data Dictionary - Gym & Supplement Store

## 1. Auth & Gym Module
*   **`users`**: Stores all accounts (Admin, Staff, Member). The `role` column handles RBAC.
*   **`membership_plans`**: The available gym packages (e.g., 1 Month, 1 Year).
*   **`memberships`**: Tracks which user bought which plan, including `start_date` and `end_date`. Used to check if a member gets a 10% discount.
*   **`checkins`**: History of when a member enters the gym.

## 2. Store Module
*   **`categories`**: Product categories (Whey, Creatine, Accessories).
*   **`products`**: The general product info (e.g., Whey Protein).
*   **`product_variants`**: Specific versions of a product (e.g., Chocolate 1kg, Vanilla 2kg). This holds the `price` and `stock`.
*   **`carts` & `cart_items`**: Temporary storage for items before checkout.
*   **`orders` & `order_items`**: Finalized purchases. `order_items` stores the price at the time of purchase.

## 3. Shared Module
*   **`payments`**: Handles money transactions. It connects to **either** an `order_id` (Store) **or** a `membership_id` (Gym), leaving the other column `NULL`.