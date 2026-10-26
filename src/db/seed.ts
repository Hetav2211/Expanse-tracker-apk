// ===== Default Category Seed Data =====
import * as SQLite from 'expo-sqlite';

interface SeedCategory {
  id: string;
  name: string;
  emoji: string;
  iconName: string;
  groupName: string;
  sortOrder: number;
}

const defaultCategories: SeedCategory[] = [
  // ===== Home and bills =====
  { id: 'cat_rent', name: 'Rent / PG', emoji: '🏠', iconName: 'home', groupName: 'Home & Bills', sortOrder: 100 },
  { id: 'cat_electricity', name: 'Electricity', emoji: '⚡', iconName: 'zap', groupName: 'Home & Bills', sortOrder: 101 },
  { id: 'cat_water', name: 'Water', emoji: '💧', iconName: 'droplet', groupName: 'Home & Bills', sortOrder: 102 },
  { id: 'cat_gas', name: 'Gas Cylinder', emoji: '🔥', iconName: 'flame', groupName: 'Home & Bills', sortOrder: 103 },
  { id: 'cat_internet', name: 'Internet / Wi-Fi', emoji: '📶', iconName: 'wifi', groupName: 'Home & Bills', sortOrder: 104 },
  { id: 'cat_mobile', name: 'Mobile Recharge', emoji: '📱', iconName: 'smartphone', groupName: 'Home & Bills', sortOrder: 105 },
  { id: 'cat_dth', name: 'DTH / Subscriptions', emoji: '📺', iconName: 'tv', groupName: 'Home & Bills', sortOrder: 106 },
  { id: 'cat_household', name: 'Household Supplies', emoji: '🧹', iconName: 'package', groupName: 'Home & Bills', sortOrder: 107 },
  { id: 'cat_repairs', name: 'Repairs & Maintenance', emoji: '🔧', iconName: 'tool', groupName: 'Home & Bills', sortOrder: 108 },
  { id: 'cat_furniture', name: 'Furniture & Appliances', emoji: '🛋️', iconName: 'box', groupName: 'Home & Bills', sortOrder: 109 },
  { id: 'cat_laundry', name: 'Laundry', emoji: '👕', iconName: 'wind', groupName: 'Home & Bills', sortOrder: 110 },

  // ===== Food and groceries =====
  { id: 'cat_groceries', name: 'Groceries', emoji: '🛒', iconName: 'shopping-cart', groupName: 'Food & Groceries', sortOrder: 200 },
  { id: 'cat_veggies', name: 'Vegetables & Fruits', emoji: '🥦', iconName: 'leaf', groupName: 'Food & Groceries', sortOrder: 201 },
  { id: 'cat_dairy', name: 'Dairy', emoji: '🥛', iconName: 'coffee', groupName: 'Food & Groceries', sortOrder: 202 },
  { id: 'cat_snacks', name: 'Snacks', emoji: '🍿', iconName: 'cookie', groupName: 'Food & Groceries', sortOrder: 203 },
  { id: 'cat_tea', name: 'Tea / Coffee', emoji: '☕', iconName: 'coffee', groupName: 'Food & Groceries', sortOrder: 204 },
  { id: 'cat_restaurant', name: 'Restaurant / Dining', emoji: '🍽️', iconName: 'utensils', groupName: 'Food & Groceries', sortOrder: 205 },
  { id: 'cat_takeaway', name: 'Takeaway / Delivery', emoji: '🥡', iconName: 'package', groupName: 'Food & Groceries', sortOrder: 206 },
  { id: 'cat_streetfood', name: 'Street Food', emoji: '🌮', iconName: 'shopping-bag', groupName: 'Food & Groceries', sortOrder: 207 },
  { id: 'cat_officemeal', name: 'Office Meals', emoji: '🍱', iconName: 'briefcase', groupName: 'Food & Groceries', sortOrder: 208 },
  { id: 'cat_drinkingwater', name: 'Drinking Water', emoji: '🚰', iconName: 'droplet', groupName: 'Food & Groceries', sortOrder: 209 },

  // ===== Travel and transport =====
  { id: 'cat_bus', name: 'Bus', emoji: '🚌', iconName: 'truck', groupName: 'Travel & Transport', sortOrder: 300 },
  { id: 'cat_train', name: 'Train', emoji: '🚂', iconName: 'navigation', groupName: 'Travel & Transport', sortOrder: 301 },
  { id: 'cat_metro', name: 'Metro', emoji: '🚇', iconName: 'navigation', groupName: 'Travel & Transport', sortOrder: 302 },
  { id: 'cat_auto', name: 'Auto-rickshaw', emoji: '🛺', iconName: 'navigation', groupName: 'Travel & Transport', sortOrder: 303 },
  { id: 'cat_taxi', name: 'Taxi / Cab', emoji: '🚕', iconName: 'navigation', groupName: 'Travel & Transport', sortOrder: 304 },
  { id: 'cat_fuel', name: 'Fuel', emoji: '⛽', iconName: 'droplet', groupName: 'Travel & Transport', sortOrder: 305 },
  { id: 'cat_parking', name: 'Parking', emoji: '🅿️', iconName: 'square', groupName: 'Travel & Transport', sortOrder: 306 },
  { id: 'cat_toll', name: 'Toll', emoji: '🛣️', iconName: 'map', groupName: 'Travel & Transport', sortOrder: 307 },
  { id: 'cat_vehicleservice', name: 'Vehicle Service', emoji: '🔧', iconName: 'tool', groupName: 'Travel & Transport', sortOrder: 308 },
  { id: 'cat_bicycle', name: 'Bicycle', emoji: '🚲', iconName: 'activity', groupName: 'Travel & Transport', sortOrder: 309 },
  { id: 'cat_flights', name: 'Flights', emoji: '✈️', iconName: 'navigation', groupName: 'Travel & Transport', sortOrder: 310 },
  { id: 'cat_hotel', name: 'Hotel / Stay', emoji: '🏨', iconName: 'home', groupName: 'Travel & Transport', sortOrder: 311 },

  // ===== Personal and lifestyle =====
  { id: 'cat_clothing', name: 'Clothing', emoji: '👗', iconName: 'shopping-bag', groupName: 'Personal & Lifestyle', sortOrder: 400 },
  { id: 'cat_footwear', name: 'Footwear', emoji: '👟', iconName: 'shopping-bag', groupName: 'Personal & Lifestyle', sortOrder: 401 },
  { id: 'cat_grooming', name: 'Grooming', emoji: '✨', iconName: 'star', groupName: 'Personal & Lifestyle', sortOrder: 402 },
  { id: 'cat_haircut', name: 'Haircut / Salon', emoji: '💇', iconName: 'scissors', groupName: 'Personal & Lifestyle', sortOrder: 403 },
  { id: 'cat_skincare', name: 'Skincare', emoji: '🧴', iconName: 'heart', groupName: 'Personal & Lifestyle', sortOrder: 404 },
  { id: 'cat_personalcare', name: 'Personal Care', emoji: '🧼', iconName: 'heart', groupName: 'Personal & Lifestyle', sortOrder: 405 },
  { id: 'cat_gym', name: 'Gym / Fitness', emoji: '💪', iconName: 'activity', groupName: 'Personal & Lifestyle', sortOrder: 406 },
  { id: 'cat_sports', name: 'Sports', emoji: '⚽', iconName: 'activity', groupName: 'Personal & Lifestyle', sortOrder: 407 },
  { id: 'cat_hobbies', name: 'Hobbies', emoji: '🎨', iconName: 'palette', groupName: 'Personal & Lifestyle', sortOrder: 408 },
  { id: 'cat_entertainment', name: 'Entertainment', emoji: '🎬', iconName: 'film', groupName: 'Personal & Lifestyle', sortOrder: 409 },
  { id: 'cat_shopping', name: 'Shopping', emoji: '🛍️', iconName: 'shopping-bag', groupName: 'Personal & Lifestyle', sortOrder: 410 },
  { id: 'cat_gifts', name: 'Gifts', emoji: '🎁', iconName: 'gift', groupName: 'Personal & Lifestyle', sortOrder: 411 },
  { id: 'cat_social', name: 'Social Outings', emoji: '🥂', iconName: 'users', groupName: 'Personal & Lifestyle', sortOrder: 412 },

  // ===== Health and education =====
  { id: 'cat_doctor', name: 'Doctor', emoji: '🩺', iconName: 'heart', groupName: 'Health & Education', sortOrder: 500 },
  { id: 'cat_medicines', name: 'Medicines', emoji: '💊', iconName: 'plus-circle', groupName: 'Health & Education', sortOrder: 501 },
  { id: 'cat_dental', name: 'Dental / Eye Care', emoji: '🦷', iconName: 'eye', groupName: 'Health & Education', sortOrder: 502 },
  { id: 'cat_healthtests', name: 'Health Tests', emoji: '🧪', iconName: 'clipboard', groupName: 'Health & Education', sortOrder: 503 },
  { id: 'cat_insurance', name: 'Insurance', emoji: '🛡️', iconName: 'shield', groupName: 'Health & Education', sortOrder: 504 },
  { id: 'cat_courses', name: 'Courses', emoji: '📚', iconName: 'book-open', groupName: 'Health & Education', sortOrder: 505 },
  { id: 'cat_books', name: 'Books & Stationery', emoji: '📖', iconName: 'book', groupName: 'Health & Education', sortOrder: 506 },
  { id: 'cat_educationfees', name: 'Education Fees', emoji: '🎓', iconName: 'award', groupName: 'Health & Education', sortOrder: 507 },
  { id: 'cat_certifications', name: 'Certifications', emoji: '📜', iconName: 'file-text', groupName: 'Health & Education', sortOrder: 508 },

  // ===== Digital and financial =====
  { id: 'cat_streaming', name: 'Streaming Subscriptions', emoji: '🎵', iconName: 'play-circle', groupName: 'Digital & Financial', sortOrder: 600 },
  { id: 'cat_apps', name: 'Apps / Software', emoji: '📲', iconName: 'download', groupName: 'Digital & Financial', sortOrder: 601 },
  { id: 'cat_cloud', name: 'Cloud Storage', emoji: '☁️', iconName: 'cloud', groupName: 'Digital & Financial', sortOrder: 602 },
  { id: 'cat_bankcharges', name: 'Bank Charges', emoji: '🏦', iconName: 'landmark', groupName: 'Digital & Financial', sortOrder: 603 },
  { id: 'cat_creditcard', name: 'Credit Card Fees', emoji: '💳', iconName: 'credit-card', groupName: 'Digital & Financial', sortOrder: 604 },
  { id: 'cat_loan', name: 'Loan Repayment', emoji: '🏧', iconName: 'trending-down', groupName: 'Digital & Financial', sortOrder: 605 },
  { id: 'cat_investment', name: 'Investment Contribution', emoji: '📈', iconName: 'trending-up', groupName: 'Digital & Financial', sortOrder: 606 },
  { id: 'cat_taxes', name: 'Taxes', emoji: '🧾', iconName: 'file-text', groupName: 'Digital & Financial', sortOrder: 607 },
  { id: 'cat_donations', name: 'Donations / Charity', emoji: '🤲', iconName: 'heart', groupName: 'Digital & Financial', sortOrder: 608 },

  // ===== Work and miscellaneous =====
  { id: 'cat_officesupplies', name: 'Office Supplies', emoji: '📎', iconName: 'paperclip', groupName: 'Work & Misc', sortOrder: 700 },
  { id: 'cat_worktravel', name: 'Work Travel', emoji: '💼', iconName: 'briefcase', groupName: 'Work & Misc', sortOrder: 701 },
  { id: 'cat_professional', name: 'Professional Expenses', emoji: '🏢', iconName: 'briefcase', groupName: 'Work & Misc', sortOrder: 702 },
  { id: 'cat_family', name: 'Family Support', emoji: '👨‍👩‍👧', iconName: 'users', groupName: 'Work & Misc', sortOrder: 703 },
  { id: 'cat_pet', name: 'Pet Care', emoji: '🐾', iconName: 'heart', groupName: 'Work & Misc', sortOrder: 704 },
  { id: 'cat_travelplanning', name: 'Travel Planning', emoji: '🗺️', iconName: 'map', groupName: 'Work & Misc', sortOrder: 705 },
  { id: 'cat_emergency', name: 'Emergency', emoji: '🚨', iconName: 'alert-triangle', groupName: 'Work & Misc', sortOrder: 706 },
  { id: 'cat_other', name: 'Other', emoji: '📦', iconName: 'package', groupName: 'Work & Misc', sortOrder: 799 },
];

/**
 * Seed default categories if not already present.
 * Only inserts categories that don't exist yet (by id).
 */
export async function seedDefaultCategories(db: SQLite.SQLiteDatabase): Promise<void> {
  const existing = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories WHERE is_system = 1'
  );

  // Skip if already seeded
  if (existing && existing.count > 0) return;

  const insertStmt = await db.prepareAsync(
    `INSERT OR IGNORE INTO categories (id, name, emoji, icon_name, group_name, is_system, is_archived, sort_order)
     VALUES ($id, $name, $emoji, $iconName, $groupName, 1, 0, $sortOrder)`
  );

  try {
    for (const cat of defaultCategories) {
      await insertStmt.executeAsync({
        $id: cat.id,
        $name: cat.name,
        $emoji: cat.emoji,
        $iconName: cat.iconName,
        $groupName: cat.groupName,
        $sortOrder: cat.sortOrder,
      });
    }
    console.log(`[DB] Seeded ${defaultCategories.length} default categories`);
  } finally {
    await insertStmt.finalizeAsync();
  }
}

export { defaultCategories };
