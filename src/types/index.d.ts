type ID = string;

type LocalFile = {
  id: ID;
  userId: ID | null;
  path: string;
  mimetype: string;
  size: number;
  metadata: unknown;
  thumbnails: string[];
}

type User = {
  id: ID;
}
