import { getFileFilter, getDimensions, base64encode, shouldFilterBy } from '../functions';

describe('Functions', () => {
  describe('getFileFilter', () => {
    test('Check file filter for jpeg image', () => {
      const cb = jest.fn();

      const fileFilter = getFileFilter('(image|video)/.+');

      fileFilter(null, { mimetype: 'image/jpeg' }, cb);

      expect(cb).toHaveBeenCalledWith(null, true);
    });

    test('Check file filter for png image', () => {
      const cb = jest.fn();

      const fileFilter = getFileFilter('(image|video)/.+');

      fileFilter(null, { mimetype: 'image/png' }, cb);

      expect(cb).toHaveBeenCalledWith(null, true);
    });
  });
  describe('getDimentions', () => {
    test('Full HD video to 800x600', async () => {
      const videoWidth = 1920;
      const videoHeight = 1080;

      const maxWidth = 800;
      const maxHeight = 600;

      const { width, height } = getDimensions(videoHeight, videoWidth, maxHeight, maxWidth);

      expect(width).toBe(800);
      expect(height).toBe(450);
    });

    test('Full HD video portrait to 800x600', async () => {
      const videoWidth = 1080;
      const videoHeight = 1920;

      const maxWidth = 800;
      const maxHeight = 600;

      const { width, height } = getDimensions(videoHeight, videoWidth, maxHeight, maxWidth);

      expect(width).toBe(450);
      expect(height).toBe(800);
    });

    test('Full HD video to full HD', async () => {
      const videoWidth = 1080;
      const videoHeight = 1920;

      const maxWidth = 1920;
      const maxHeight = 1080;

      const { width, height } = getDimensions(videoHeight, videoWidth, maxHeight, maxWidth);

      expect(width).toBe(1920);
      expect(height).toBe(1080);
    });
  });

  describe('base64encode', () => {
    test('Text to base64', async () => {
      expect(base64encode('test')).toBe('dGVzdA==');
    });
  });

  describe('shouldFilterBy', () => {
    test('Check variable', async () => {
      const name = undefined;
      const surname = null;
      const email = 'email@address';

      expect(shouldFilterBy(name)).toBe(false);
      expect(shouldFilterBy(surname)).toBe(false);
      expect(shouldFilterBy(email)).toBe(true);
    });

    test('Check object variable', async () => {
      const user = {
        name: undefined,
        surname: null,
        email: 'email@address',
      };

      expect(shouldFilterBy(user.name)).toBe(false);
      expect(shouldFilterBy(user.surname)).toBe(false);
      expect(shouldFilterBy(user.email)).toBe(true);
    });
  });
});
