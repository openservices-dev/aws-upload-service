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

  interface Trace {
    openSegment(defaultName: string): import ('express').RequestHandler | import ('express').RequestHandler[];

    closeSegment(): import ('express').ErrorRequestHandler;

    createSegment(name: string, rootId?: string | null, parentId?: string | null): unknown;

    setSegment(segment: unknown): void;

    getTraceId(): string;

    getNamespace(): unknown;

    captureAWSv3Client<T>(client: T): T;

    captureHTTPRequests(): void;

    processTraceData(data: string): { [key: string]: string };
  }
}
