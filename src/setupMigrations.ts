import { Client, query as q } from "faunadb";
import chalk from "chalk";
import {wait} from './utils';

const setupMigrations = async (client: Client) => {
  try {
    console.log("Setup migrations...");

    const hasSetup = await client.query(q.Exists(q.Collection("Migration")));
    if (hasSetup) {
      console.log("Setup is already done.");
      return;
    }

    await client.query(q.CreateCollection({name: "Migration"}));
    await client.query(
        q.CreateIndex({
          name: "all_migrations",
          source: q.Collection("Migration")
        })
    );
    await waitUntilIndexIsActive(client, "all_migrations");
    console.log(chalk.green("Migration setup completed"));
  } catch (error) {
    console.error(chalk.red(`${chalk.bold("Error")}: ${error.message}`));
  }
};

async function waitUntilIndexIsActive(client: Client, indexName: string) {
  console.log(`Waiting for index ${indexName} to become active`);
  // Wait for max 15 seconds
  for(let i = 0; i < 30; i++) {
    const indexIsActive = await client.query(q.Select("active", q.Get(q.Index("all_migrations"))));
    if(indexIsActive) {
      return;
    } else {
      await wait(500);
    }
  }
  throw Error(`Waiting for index ${indexName} to become active timed out...`)
}

export default setupMigrations;
