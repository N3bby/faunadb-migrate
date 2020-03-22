import {Client, query as q} from "faunadb";
import chalk from "chalk";
import {waitUntilIndexIsActive} from './utils';

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

export default setupMigrations;
