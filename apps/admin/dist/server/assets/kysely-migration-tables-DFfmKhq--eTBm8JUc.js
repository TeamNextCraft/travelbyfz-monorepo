//#region node_modules/.pnpm/@better-auth+kysely-adapter_7bfff8e7e743e090be4154c28b020860/node_modules/@better-auth/kysely-adapter/dist/kysely-migration-tables-DFfmKhq-.mjs
/**
* Kysely's internal migration table names, mirrored as local constants.
*
* Kysely 0.29 moved these from its main entry to the `kysely/migration`
* subpath (which 0.28 lacks), and the main entry now exports only type stubs
* with no runtime value, which breaks strict ESM bundlers.
*
* The values are stable parts of Kysely's public migration contract. Mirroring
* them allows the SQLite dialects to support both Kysely 0.28 and 0.29.
*
* TODO: Import these from `kysely/migration` after dropping Kysely 0.28.
*/
var DEFAULT_MIGRATION_TABLE = "kysely_migration";
var DEFAULT_MIGRATION_LOCK_TABLE = "kysely_migration_lock";
//#endregion
export { DEFAULT_MIGRATION_TABLE as n, DEFAULT_MIGRATION_LOCK_TABLE as t };
