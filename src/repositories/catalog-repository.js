import pool from "../../db.js";
import { config } from "../config.js";

function yearBoundExpression(column) {
  return `CAST(CASE WHEN ${column} = '' OR ${column} IS NULL THEN DATE_FORMAT(CURDATE(), '%Y') ELSE LEFT(${column}, 4) END AS UNSIGNED)`;
}

export async function searchManufacturers(term, limit = 6) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        manufacturer,
        CASE
          WHEN LOWER(manufacturer) = LOWER(?) THEN 0
          WHEN LOWER(manufacturer) LIKE LOWER(CONCAT(?, '%')) THEN 1
          ELSE 2
        END AS match_rank
      FROM car_manufacturers
      WHERE LOWER(manufacturer) LIKE LOWER(?)
      ORDER BY match_rank, LENGTH(manufacturer), manufacturer
      LIMIT ?
    `,
    [term, term, `%${term}%`, limit]
  );
  return rows;
}

export async function searchModels(manufacturerId, term, limit = 6) {
  const [rows] = await pool.query(
    `
      SELECT
        id,
        model,
        CASE
          WHEN LOWER(model) = LOWER(?) THEN 0
          WHEN LOWER(model) LIKE LOWER(CONCAT(?, '%')) THEN 1
          ELSE 2
        END AS match_rank
      FROM car_models
      WHERE manufacturer = ?
        AND LOWER(model) LIKE LOWER(?)
      ORDER BY match_rank, LENGTH(model), model
      LIMIT ?
    `,
    [term, term, manufacturerId, `%${term}%`, limit]
  );
  return rows;
}

export async function searchWheelModels(term, limit = 6) {
  const [rows] = await pool.query(
    `
      SELECT
        m.id,
        m.model,
        CASE
          WHEN LOWER(m.model) = LOWER(?) THEN 0
          WHEN LOWER(m.model) LIKE LOWER(CONCAT(?, '%')) THEN 1
          ELSE 2
        END AS match_rank
      FROM am_wheel_models m
      JOIN am_wheel_lines l ON l.id = m.line
      WHERE l.id = ?
        AND LOWER(m.model) LIKE LOWER(?)
      ORDER BY match_rank, LENGTH(m.model), m.model
      LIMIT ?
    `,
    [term, term, config.fondmetalLineId, `%${term}%`, limit]
  );
  return rows;
}

export async function listYearsByBrandModel(manufacturerId, modelId) {
  const [rows] = await pool.query(
    `
      SELECT DISTINCT
        CAST(LEFT(c.production_time_start, 4) AS UNSIGNED) AS year_start,
        ${yearBoundExpression("c.production_time_stop")} AS year_stop
      FROM cars c
      WHERE c.car_model = ?
      ORDER BY year_start, year_stop
    `,
    [modelId]
  );

  const years = new Set();
  for (const row of rows) {
    if (!row.year_start || !row.year_stop || row.year_stop < row.year_start) {
      continue;
    }
    for (let year = row.year_start; year <= row.year_stop; year += 1) {
      years.add(year);
    }
  }
  return [...years].sort((left, right) => left - right);
}

export async function listWheelOptionsForCar({ manufacturerId, modelId, year }) {
  const [rows] = await pool.query(
    `
      SELECT
        awm.id AS wheel_model_id,
        awm.model AS wheel_model,
        aw.diameter,
        GROUP_CONCAT(DISTINCT f.name ORDER BY f.name SEPARATOR ', ') AS finishes
      FROM cars c
      JOIN car_models cm ON cm.id = c.car_model
      JOIN applications a ON a.car = c.id
      JOIN am_wheels aw ON aw.id = a.am_wheel AND aw.status = 'ACTIVE'
      JOIN am_wheel_models awm ON awm.id = aw.model
      JOIN am_wheel_lines awl ON awl.id = awm.line AND awl.id = ?
      LEFT JOIN am_wheel_versions v ON v.am_wheel = aw.id AND v.status IN ('', 'ACTIVE')
      LEFT JOIN finishes f ON f.id = v.finish
      WHERE cm.manufacturer = ?
        AND cm.id = ?
        AND ? BETWEEN CAST(LEFT(c.production_time_start, 4) AS UNSIGNED)
          AND ${yearBoundExpression("c.production_time_stop")}
      GROUP BY awm.id, awm.model, aw.diameter
      ORDER BY aw.diameter DESC, awm.model
      LIMIT 100
    `,
    [config.fondmetalLineId, manufacturerId, modelId, year]
  );

  return rows;
}

export async function listHomologationOptionsForCar({ manufacturerId, modelId, year }) {
  const [rows] = await pool.query(
    `
      SELECT
        awm.model AS wheel_model,
        aw.diameter,
        aw.width,
        aw.et,
        p.pcd AS pcd_label,
        a.plug_play,
        a.fitment_type,
        a.fitment_advice,
        a.limitation_IT,
        a.homologation_tuv,
        a.homologation_kba,
        a.homologation_ece,
        a.homologation_jwl,
        a.homologation_ita
      FROM cars c
      JOIN car_models cm ON cm.id = c.car_model
      JOIN applications a ON a.car = c.id
      JOIN am_wheels aw ON aw.id = a.am_wheel AND aw.status = 'ACTIVE'
      JOIN am_wheel_models awm ON awm.id = aw.model
      JOIN am_wheel_lines awl ON awl.id = awm.line AND awl.id = ?
      LEFT JOIN pcds p ON p.id = aw.pcd
      WHERE cm.manufacturer = ?
        AND cm.id = ?
        AND ? BETWEEN CAST(LEFT(c.production_time_start, 4) AS UNSIGNED)
          AND ${yearBoundExpression("c.production_time_stop")}
        AND (
          a.homologation_tuv != '' OR
          a.homologation_kba != '' OR
          a.homologation_ece != '' OR
          a.homologation_jwl != '' OR
          a.homologation_ita != ''
        )
      ORDER BY aw.diameter DESC, awm.model, aw.width, aw.et
      LIMIT 120
    `,
    [config.fondmetalLineId, manufacturerId, modelId, year]
  );
  return rows;
}

export async function getWheelInfo(wheelModelId) {
  const [rows] = await pool.query(
    `
      SELECT
        m.id,
        m.model,
        GROUP_CONCAT(DISTINCT aw.diameter ORDER BY aw.diameter DESC) AS diameters,
        GROUP_CONCAT(DISTINCT f.name ORDER BY f.name SEPARATOR ', ') AS finishes
      FROM am_wheel_models m
      JOIN am_wheel_lines l ON l.id = m.line AND l.id = ?
      JOIN am_wheels aw ON aw.model = m.id AND aw.status = 'ACTIVE'
      LEFT JOIN am_wheel_versions v ON v.am_wheel = aw.id AND v.status IN ('', 'ACTIVE')
      LEFT JOIN finishes f ON f.id = v.finish
      WHERE m.id = ?
      GROUP BY m.id, m.model
      LIMIT 1
    `,
    [config.fondmetalLineId, wheelModelId]
  );
  return rows[0] || null;
}

export async function listCarsForWheel({ wheelModelId, diameter }) {
  const [rows] = await pool.query(
    `
      SELECT DISTINCT
        man.manufacturer,
        cm.model,
        CAST(LEFT(c.production_time_start, 4) AS UNSIGNED) AS year_start,
        ${yearBoundExpression("c.production_time_stop")} AS year_stop
      FROM applications a
      JOIN cars c ON c.id = a.car
      JOIN car_models cm ON cm.id = c.car_model
      JOIN car_manufacturers man ON man.id = cm.manufacturer
      JOIN am_wheels aw ON aw.id = a.am_wheel AND aw.status = 'ACTIVE' AND aw.diameter = ?
      JOIN am_wheel_models awm ON awm.id = aw.model AND awm.id = ?
      JOIN am_wheel_lines awl ON awl.id = awm.line AND awl.id = ?
      ORDER BY man.manufacturer, cm.model, year_start
      LIMIT 100
    `,
    [diameter, wheelModelId, config.fondmetalLineId]
  );
  return rows;
}

export async function getExactFitment({ manufacturerId, modelId, year, wheelModelId, diameter }) {
  const [rows] = await pool.query(
    `
      SELECT
        a.id AS application_id,
        awm.model AS wheel_model,
        aw.diameter,
        aw.width,
        aw.et,
        p.pcd AS pcd_label,
        a.plug_play,
        a.fitment_type,
        a.fitment_advice,
        a.limitation_IT,
        a.homologation_tuv,
        a.homologation_kba,
        a.homologation_ece,
        a.homologation_jwl,
        a.homologation_ita
      FROM cars c
      JOIN car_models cm ON cm.id = c.car_model
      JOIN applications a ON a.car = c.id
      JOIN am_wheels aw ON aw.id = a.am_wheel
        AND aw.status = 'ACTIVE'
        AND aw.diameter = ?
      JOIN am_wheel_models awm ON awm.id = aw.model AND awm.id = ?
      JOIN am_wheel_lines awl ON awl.id = awm.line AND awl.id = ?
      LEFT JOIN pcds p ON p.id = aw.pcd
      WHERE cm.manufacturer = ?
        AND cm.id = ?
        AND ? BETWEEN CAST(LEFT(c.production_time_start, 4) AS UNSIGNED)
          AND ${yearBoundExpression("c.production_time_stop")}
      ORDER BY aw.width, aw.et, a.id
      LIMIT 30
    `,
    [
      diameter,
      wheelModelId,
      config.fondmetalLineId,
      manufacturerId,
      modelId,
      year,
    ]
  );
  return rows;
}

export async function listBrands() {
  const [rows] = await pool.query(
    `
      SELECT DISTINCT manufacturer
      FROM car_manufacturers
      ORDER BY manufacturer
    `
  );
  return rows.map((row) => row.manufacturer);
}

export async function listModelsForBrand(brand) {
  const [rows] = await pool.query(
    `
      SELECT DISTINCT cm.model
      FROM car_models cm
      JOIN car_manufacturers man ON man.id = cm.manufacturer
      WHERE man.manufacturer = ?
      ORDER BY cm.model
    `,
    [brand]
  );
  return rows.map((row) => row.model);
}

export async function listYearsForBrandModel(brand, model) {
  const [rows] = await pool.query(
    `
      SELECT DISTINCT
        CAST(LEFT(c.production_time_start, 4) AS UNSIGNED) AS year_start,
        ${yearBoundExpression("c.production_time_stop")} AS year_stop
      FROM cars c
      JOIN car_models cm ON cm.id = c.car_model
      JOIN car_manufacturers man ON man.id = cm.manufacturer
      WHERE man.manufacturer = ?
        AND cm.model = ?
      ORDER BY year_start, year_stop
    `,
    [brand, model]
  );

  const years = new Set();
  for (const row of rows) {
    if (!row.year_start || !row.year_stop || row.year_stop < row.year_start) {
      continue;
    }
    for (let year = row.year_start; year <= row.year_stop; year += 1) {
      years.add(year);
    }
  }
  return [...years].sort((left, right) => left - right);
}

export async function listWheelsForBrandModelYear(brand, model, year) {
  const [rows] = await pool.query(
    `
      SELECT DISTINCT
        awm.model AS wheel_model_name,
        aw.diameter AS wheel_diameter
      FROM car_manufacturers man
      JOIN car_models cm ON cm.manufacturer = man.id
      JOIN cars c ON c.car_model = cm.id
      JOIN applications a ON a.car = c.id
      JOIN am_wheels aw ON aw.id = a.am_wheel AND aw.status = 'ACTIVE'
      JOIN am_wheel_models awm ON awm.id = aw.model
      JOIN am_wheel_lines awl ON awl.id = awm.line AND awl.id = ?
      WHERE man.manufacturer = ?
        AND cm.model = ?
        AND ? BETWEEN CAST(LEFT(c.production_time_start, 4) AS UNSIGNED)
          AND ${yearBoundExpression("c.production_time_stop")}
      ORDER BY awm.model, aw.diameter DESC
    `,
    [config.fondmetalLineId, brand, model, year]
  );
  return rows;
}

export async function getFitmentByIds(carId, wheelId) {
  const [rows] = await pool.query(
    `
      SELECT
        a.id,
        a.car,
        a.am_wheel,
        a.centering_ring,
        a.bolt_nut,
        a.homologation_tuv,
        a.homologation_tuv_doc,
        a.note_tuv,
        a.homologation_kba,
        a.homologation_kba_doc,
        a.note_kba,
        a.homologation_ece,
        a.homologation_ece_doc,
        a.note_ece,
        a.homologation_jwl,
        a.homologation_jwl_doc,
        a.homologation_ita,
        a.homologation_ita_doc,
        a.note_ita,
        a.limitation,
        a.limitation_IT,
        a.fitment_type,
        a.fitment_advice,
        a.plug_play
      FROM applications a
      WHERE a.car = ? AND a.am_wheel = ?
      LIMIT 1
    `,
    [carId, wheelId]
  );
  return rows[0] || null;
}

export async function describeTables(tableNames) {
  const result = {};
  for (const table of tableNames) {
    const [rows] = await pool.query(`DESCRIBE ${table}`);
    result[table] = rows.map((row) => ({
      Field: row.Field,
      Type: row.Type,
    }));
  }
  return result;
}

export async function listTables() {
  const [rows] = await pool.query("SHOW TABLES");
  return rows;
}

export async function listApplicationsSample() {
  const [rows] = await pool.query("SELECT * FROM applications LIMIT 10");
  return rows;
}

export async function pingDatabase() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  return rows[0]?.ok === 1;
}

export async function databaseVersion() {
  const [rows] = await pool.query("SELECT VERSION() AS version");
  return rows[0]?.version || null;
}
