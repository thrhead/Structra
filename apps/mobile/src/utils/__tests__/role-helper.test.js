import { describe, it, expect } from 'vitest';
import { getRoleBadgeColor, getRoleText } from '../role-helper';

describe('role-helper utilities', () => {
  describe('getRoleBadgeColor', () => {
    it('should return correct color for admin', () => {
        expect(getRoleBadgeColor('ADMIN')).toBe('#EF4444');
    });
    it('should return correct color for manager', () => {
        expect(getRoleBadgeColor('manager')).toBe('#F59E0B');
    });
    it('should return default color for unknown role', () => {
        expect(getRoleBadgeColor('UNKNOWN')).toBe('#6B7280');
    });
  });

  describe('getRoleText', () => {
    it('should return correct text for worker', () => {
        expect(getRoleText('WORKER')).toBe('Çalışan');
    });
    it('should return correct text for team_lead', () => {
        expect(getRoleText('TEAM_LEAD')).toBe('Ekip Lideri');
    });
    it('should return default text for unknown role', () => {
        expect(getRoleText('UNKNOWN')).toBe('Kullanıcı');
    });
  });
});
