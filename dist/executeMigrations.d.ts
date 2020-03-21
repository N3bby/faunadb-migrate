import { Migration } from "../index";
import { Client, query as q } from "faunadb";
declare type ExecuteMigrationsConfig = {
    client: Client;
    queryBuilder: typeof q;
    migrationId?: string;
};
declare const executeMigrations: (migrations: Migration[], operation: "down" | "up" | undefined, { client, queryBuilder, migrationId }: ExecuteMigrationsConfig) => Promise<Migration[]>;
export default executeMigrations;
