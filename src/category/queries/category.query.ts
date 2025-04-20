export const FIND_CATEGORY_WITH_SUBTREE = `
        WITH RECURSIVE subtree AS (
        SELECT *, 1 AS level FROM category WHERE id = $1
        UNION ALL
        SELECT c.*, s.level + 1
        FROM category c
        JOIN subtree s ON c.parent_category_id = s.id
        WHERE s.level < $2
      )
      SELECT * FROM subtree;
      `;
