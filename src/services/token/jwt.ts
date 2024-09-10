import jwt from 'jsonwebtoken';

class JWTToken implements Services.Token {
  constructor(
    protected secret: string,
  ) {}

  public generate(data: Record<string, unknown>): string {
    return jwt.sign(data, this.secret, { algorithm: 'HS512' });
  }

  public verify(token: string): Record<string, unknown> {
    return jwt.verify(token, this.secret) as Record<string, unknown>;
  }

  public getUserData(data: Record<string, unknown>): { id: ID } {
    return {
      id: data.id as ID,
    };
  }
}

export default JWTToken;
