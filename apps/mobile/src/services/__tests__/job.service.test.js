import { describe, it, expect, vi, beforeEach } from 'vitest';
import jobService from '../job.service';
import api from '../api';

vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('JobService (Offline Support)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle offline completion when api returns 202', async () => {
    const mockResponse = {
      status: 202,
      data: {
        message: 'İşlem kuyruğa alındı ve bağlantı sağlandığında gönderilecek.',
        offline: true
      }
    };
    api.post.mockResolvedValue(mockResponse);

    const result = await jobService.completeJob('123');

    expect(api.post).toHaveBeenCalledWith('/api/worker/jobs/123/complete', expect.any(Object));
    expect(result.offline).toBe(true);
    expect(result.message).toContain('kuyruğa alındı');
  });

  it('should handle offline update when api returns 202', async () => {
    const mockResponse = {
      status: 202,
      data: {
        offline: true
      }
    };
    api.put.mockResolvedValue(mockResponse);

    const result = await jobService.update('123', { title: 'New' });

    expect(api.put).toHaveBeenCalledWith('/api/admin/jobs/123', { title: 'New' });
    expect(result.offline).toBe(true);
  });
});
