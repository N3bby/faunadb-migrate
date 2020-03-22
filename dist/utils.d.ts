import { Client } from 'faunadb';
export declare const asyncForEach: (array: any[], callback: any) => Promise<void>;
export declare function wait(milliseconds: number): Promise<void>;
export declare function waitUntilIndexIsActive(client: Client, indexName: string): Promise<void>;
