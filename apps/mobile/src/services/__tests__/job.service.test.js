import jobService from '../job.service';
import api from '../api';

jest.mock('../api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    put: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  }
}));

describe('JobService (Offline Support)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle offline completion when api returns 202', async () => {
    const mockResponse = {
      status: 202,
      data: {
        message: 'İşlem kuyruğa alındı ve bağlantı sağlandığında gönderilecek.',
        offline: true
      }
    };
    (api.post || api.default.post).mockResolvedValue(mockResponse);

    const result = await jobService.completeJob('123');

    expect(api.post || api.default.post).toHaveBeenCalled();
    expect(result.offline).toBe(true);
  });
});
