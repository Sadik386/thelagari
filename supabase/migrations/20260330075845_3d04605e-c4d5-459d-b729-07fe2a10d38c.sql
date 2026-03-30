
INSERT INTO product_variants (product_id, variant_name, price_modifier, sku, stock_level)
SELECT p.id, v.size_name, 0, CONCAT(v2.sku_prefix, '-', v.size_name), v.stock
FROM products p
CROSS JOIN (VALUES
  ('S', 30),
  ('M', 50),
  ('L', 40),
  ('XL', 20)
) AS v(size_name, stock)
CROSS JOIN (VALUES
  ('essential-crew-tee', 'ECT'),
  ('oversized-graphic-tee', 'OGT'),
  ('classic-pullover-hoodie', 'CPH'),
  ('zip-up-track-hoodie', 'ZTH'),
  ('relaxed-chino-pants', 'RCP'),
  ('fleece-jogger-pants', 'FJP'),
  ('lightweight-bomber-jacket', 'LBJ'),
  ('quilted-puffer-vest', 'QPV')
) AS v2(prod_slug, sku_prefix)
WHERE p.slug = v2.prod_slug;
