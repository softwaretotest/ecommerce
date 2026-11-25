## Naming & Folder Convention

- **Service Class Naming:** Service classes use `ucfirst` on the first segment only (no `StudlyCase`),
  with underscore-separated lowercase segments
  (e.g., `ShopService`, `ProductService`, `UserService`, `OrderService`, `Select_productService`).

- **Entity / Subfolder Resolution:** Removing the `Service` suffix
  and lowercasing the remaining string yields the entity/subfolder name directly without Reflection
  (e.g., `Select_productService` -> `select_product`, `ShopService` -> `shop`).

- **Storage & Database Path:** Files are stored under `<disk_root>/<folder>/<filename>`
  and only the relative path (`<folder>/<filename>`) is persisted in the database.

- **Default Image Fallback:** A default fallback image path is used
  when no image is provided or when a stored file is missing,
  ensuring records remain valid without breaking UI.

- **Public vs. Private Disks:** The public disk
  (`public` via `php artisan storage:link`) is used for public assets,
  while a non-public disk (`local` / private) can be selected
  for restricted media without exposing direct public URLs.
