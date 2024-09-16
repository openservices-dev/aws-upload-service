type ID = string;

type LocalFile = {
  id: ID;
  user?: { id: ID } | null;
  path: string;
  mimetype: string;
  size: number;
  metadata: unknown;
  thumbnails: string[];
  cacheable: boolean;
}

type User = {
  id: ID;
}
