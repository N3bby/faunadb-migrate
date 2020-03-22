import {Client, query as q} from 'faunadb';

export const asyncForEach = async (array: any[], callback: any) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export async function wait(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export async function waitUntilIndexIsActive(client: Client, indexName: string) {
  console.log(`Waiting for index ${indexName} to become active`);
  // Wait for max 15 seconds
  for (let i = 0; i < 30; i++) {
    const indexIsActive = await client.query(q.Select("active", q.Get(q.Index("all_migrations"))));
    if (indexIsActive) {
      return;
    } else {
      await wait(500);
    }
  }
  throw Error(`Waiting for index ${indexName} to become active timed out...`)
}
