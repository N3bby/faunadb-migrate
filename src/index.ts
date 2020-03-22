#!/usr/bin/env node

import program from "commander";
import faunadb, {ClientConfig} from "faunadb";
import setupMigrations from "./setupMigrations";
import createMigration from "./createMigration";
import migrate from "./migrate";
import rollback from "./rollback";
const MIGRATION_FOLDER = "./migrations";
const clientConfig: ClientConfig = {
  scheme: process.env.FAUNADB_USE_HTTP ? 'http' : 'https',
  secret: String(process.env.FAUNADB_SECRET)
};
if(process.env.FAUNADB_DOMAIN) {
  clientConfig.domain = process.env.FAUNADB_DOMAIN;
}
const client = new faunadb.Client(clientConfig);

export {
  setupMigrations,
  createMigration,
  migrate,
  rollback,
  MIGRATION_FOLDER
};

program.version("0.0.1").description("Fauna migrate tool");

program
  .command("setup")
  .description("Setup migrations")
  .action(() => setupMigrations(client));

program
  .command("create <migrationName>")
  .description("Create a migration file")
  .action((migrationName: string) =>
    createMigration(migrationName, MIGRATION_FOLDER)
  );

program
  .command("migrate")
  .description("Run migrations")
  .action(() => migrate(MIGRATION_FOLDER, client));

program
  .command("rollback")
  .description("Run rollback")
  .action(() => rollback(MIGRATION_FOLDER, client));

// Only try to execute command if this tool is being called directly
// Prevent this code from being executed if loaded by a test framework
if(require.main === module) {
  program.parse(process.argv);
}

