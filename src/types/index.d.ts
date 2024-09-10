type ID = string;

type LocalFile = {
  id: ID;
  userId: ID | null;
  path: string;
  mimetype: string;
  size: number;
  metadata: unknown;
}

type Thumbnail = {
  id: ID;
  fileId: ID;
  path: string;
  mimetype: string;
  size: number;
}

type User = {
  id: ID;
}
