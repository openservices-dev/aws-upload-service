declare namespace Services {
  type Database = import ('@aws-sdk/client-dynamodb').DynamoDBClient;

  interface Storage {
    store(body: unknown, path: string, tags?: Record<string, string | number>): Promise<void>;

    retrieve(path: string): Promise<unknown>;

    delete(path: string): Promise<void>;
  }

  interface Queue {
    sendMessage(message: unknown): Promise<unknown>;
  }

  interface Token {
    generate(data: Record<string, unknown>): string;

    verify(token: string): Record<string, unknown> | Promise<Record<string, unknown>>;

    getUserData(data: Record<string, unknown>): { id: ID };
  }

  interface CDN {
    getUrl(url: string): string;

    getSignedUrl(path: string): string;
  }

  interface Metadata {
    getMetadata(mimetype: string, file: Buffer | string | unknown): Promise<unknown>;
  }

  namespace Metadata {
    interface Strategy {
      getMetadata(file: Buffer | string | unknown): Promise<unknown>;
    }
  }

  interface Job {
    process(mimetype: string, file: LocalFile): Promise<unknown>;
  }

  namespace Job {
    interface Strategy {
      process(file: LocalFile): Promise<unknown>;
    }

    interface Completable {
      complete(payload: any): Promise<void>;
    }
  }
}
